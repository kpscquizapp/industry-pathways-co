# Anti-Cheat API Workflow Guide

## Overview

The Anti-Cheat system monitors candidates during assessments by tracking sessions, recording activities, and logging violations.

---

## Complete Workflow Sequence

### Phase 1: Session Initialization

**Purpose:** Create a monitoring session before any assessment begins

```
POST /api/v1/session/start
Body: {
  "candidateId": "candidate-uuid",
  "jobId": "job-uuid-optional"
}
Response: {
  "sessionId": "session-uuid"
}
```

✅ **Use Case:** Call this when candidate enters the exam/assessment portal
✅ **Timing:** Before enabling any recording or assessment features
✅ **Who Calls:** Backend system or assessment platform
⚠️ **Important:** Save the `sessionId` - needed for all subsequent calls

---

### Phase 2: Start Recording (Parallel - Optional but Recommended)

**Purpose:** Begin webcam and/or screen recording immediately after session starts

```
POST /api/v1/recordings/start
Body: {
  "sessionId": "session-uuid",
  "type": "webcam" | "screen" | "audio"
}
Response: {
  "recordingId": 1,
  "nextChunkIndex": 0,
  "resumed": false
}
```

✅ **Recommended Types:**

- `webcam` - Monitor candidate's face and environment
- `screen` - Capture code/assessment content (for coding tests)
- `audio` - Record audio (optional)

✅ **Timing:** Immediately after session starts
✅ **Duration:** Continues until `/recordings/end` is called
⚠️ **Important:** You can start multiple recording types for the same session

---

### Phase 3: Assessment Execution

**Duration:** While candidate is taking the test

#### 3a. Establish Real-Time Chunk Upload Stream

```
GET /api/v1/recordings/stream/:sessionId?type=webcam
(Server-Sent Events - SSE Connection)
```

✅ **Purpose:** Keep connection alive for real-time chunk notifications
✅ **Keep-Alive:** Server sends heartbeat every 30 seconds
✅ **Streaming Updates:** Notified when chunks are successfully received

#### 3b. Upload Recording Chunks Periodically

```
POST /api/v1/recordings/chunk/:sessionId/:type/:chunkIndex
Body: (multipart/form-data)
{
  "chunk": <binary-file>,
  "clientTimestamp": "2024-04-13T10:30:00Z",
  "durationMs": 10000,
  "metadata": { "fps": 30 }
}
Response: {
  "success": true,
  "checksum": "abcd1234...",
  "chunkIndex": 0,
  "recordingId": 1,
  "size": 5242880
}
```

✅ **Recommended Interval:** Every 10-30 seconds
✅ **Chunk Size:** ~5-10 MB per chunk (adjust based on bandwidth)
✅ **Checksum:** Automatically calculated for integrity verification
✅ **Grace Period:** 60 seconds after session ends to complete uploads

---

### Phase 4: Violation Logging (During Assessment)

**Purpose:** Log suspicious behavior without interrupting assessment

```
POST /api/v1/violations/log
Body: {
  "sessionId": "session-uuid",
  "type": "tab_switch" | "face_not_detected" | "multiple_faces" | "phone_detected" | "copying_detected",
  "questionId": "question-uuid-optional",
  "meta": { "details": "optional object" }
}
Response: {
  "message": "Violation logged"
}
```

✅ **Valid Violation Types:**

- `tab_switch` - Candidate switched tabs/windows
- `face_not_detected` - Face not visible in webcam
- `multiple_faces` - Multiple people in frame
- `phone_detected` - Phone activity detected
- `copying_detected` - Copy/paste detected
- `suspicious_behavior` - Other suspicious activities

✅ **Timing:** Log violations in real-time when detected on client
✅ **Frequency:** Can log multiple violations per session
✅ **Non-Blocking:** Does not interrupt candidate experience

---

### Phase 5: Session Monitoring & Heartbeat

**Purpose:** Keep session alive and responsive

```
POST /api/v1/recordings/ping
Body: { "sessionId": "session-uuid" }
Response: {
  "sessionId": "session-uuid",
  "status": "alive",
  "timestamp": "2024-04-13T10:45:00Z"
}
```

✅ **Frequency:** Every 30 seconds (or less if needed)
✅ **Purpose:** Ensures server knows session is still active
✅ **Prevents Timeout:** Session automatically ends after inactivity

---

### Phase 6: Assessment Completion

**Purpose:** Clean up and finalize recordings

#### 6a. End Recording

```
POST /api/v1/recordings/end
Body: {
  "sessionId": "session-uuid",
  "type": "webcam"
}
Response: {
  "success": true,
  "recordingId": 1,
  "totalChunks": 12,
  "integrity": {
    "allChunksPresent": true,
    "checksumVerified": true,
    "gapDetected": false
  }
}
```

✅ **Timing:** Call when assessment ends (candidate finishes or time runs out)
✅ **Integrity Report:** Returns verification status
✅ **Grace Period:** Remaining chunks can be uploaded within 60 seconds

#### 6b. End Session

```
POST /api/v1/session/end
Body: { "sessionId": "session-uuid" }
Response: { "message": "Session ended" }
```

✅ **Timing:** After all recordings are finalized
✅ **Status:** Session marked as 'completed'
✅ **Final Step:** All monitoring ends here

---

### Phase 7: Review & Analysis

**Purpose:** Retrieve full session data for review

#### 7a. Get Session Summary with Violations

```
GET /api/v1/session/:id
Response: {
  "session": {
    "id": "session-uuid",
    "candidate_id": "candidate-uuid",
    "job_id": "job-uuid",
    "started_at": "2024-04-13T10:00:00Z",
    "ended_at": "2024-04-13T10:45:00Z",
    "status": "completed"
  },
  "violations": [
    {
      "id": 1,
      "type": "tab_switch",
      "timestamp": "2024-04-13T10:15:30Z",
      "meta": null
    },
    {
      "id": 2,
      "type": "face_not_detected",
      "timestamp": "2024-04-13T10:25:45Z",
      "meta": null
    }
  ]
}
```

#### 7b. Get Recording Chunk Metadata

```
GET /api/v1/recordings/chunks/:sessionId/metadata
Response: {
  "sessionId": "session-uuid",
  "totalChunks": 12,
  "chunks": [
    {
      "chunk_index": 0,
      "size_bytes": 5242880,
      "checksum": "abc123...",
      "timestamp": "2024-04-13T10:00:30Z"
    }
    // ... more chunks
  ]
}
```

#### 7c. Play Complete Recording

```
GET /api/v1/recordings/play/:sessionId/:type
(Returns video/webm stream - automatically merges all chunks)
```

✅ **Purpose:** Review candidate's recording in sequence

---

## Complete Example Flow

### Timeline for a Coding Assessment

```
10:00:00 → POST /session/start
           ├─ Response: sessionId = "abc123"

10:00:05 → POST /recordings/start (webcam)
           ├─ Response: recordingId = 1

10:00:10 → GET /recordings/stream/:sessionId (SSE connection opens)
           ├─ Heartbeat: connected

10:00:15 → POST /recordings/chunk/:sessionId/webcam/0 (First chunk)
           ├─ Response: checksum verified

10:00:30 → POST /recordings/ping (Keep alive)
10:00:45 → POST /recordings/chunk/:sessionId/webcam/1 (Second chunk)
10:01:00 → POST /recordings/ping (Keep alive)
10:01:15 → POST /recordings/chunk/:sessionId/webcam/2 (Third chunk)

10:05:30 → POST /violations/log
           ├─ type: "tab_switch"

10:15:00 → POST /violations/log
           ├─ type: "face_not_detected"

10:45:00 → POST /recordings/end (Assessment finished)
           ├─ Response: totalChunks = 45, integrity verified

10:45:05 → POST /session/end
           ├─ Response: Session completed

10:45:30 → GET /session/:id
           ├─ Response: Full session data + 2 violations

10:46:00 → GET /recordings/play/:sessionId/webcam
           ├─ Stream: Complete video file
```

---

## Client-Side Implementation Pattern

### React/JavaScript Example

```javascript
class AntiCheatSession {
  constructor(candidateId, jobId) {
    this.candidateId = candidateId;
    this.jobId = jobId;
    this.sessionId = null;
    this.recordingId = null;
    this.chunkIndex = 0;
  }

  async startSession() {
    const res = await fetch('/api/v1/session/start', {
      method: 'POST',
      body: JSON.stringify({ candidateId: this.candidateId, jobId: this.jobId }),
    });
    const { sessionId } = await res.json();
    this.sessionId = sessionId;
    return sessionId;
  }

  async startRecording(type = 'webcam') {
    const res = await fetch('/api/v1/recordings/start', {
      method: 'POST',
      body: JSON.stringify({ sessionId: this.sessionId, type }),
    });
    const { recordingId } = await res.json();
    this.recordingId = recordingId;
    return recordingId;
  }

  async uploadChunk(chunk) {
    const formData = new FormData();
    formData.append('chunk', chunk);
    formData.append('sessionId', this.sessionId);
    formData.append('type', 'webcam');
    formData.append('chunkIndex', this.chunkIndex);
    formData.append('clientTimestamp', new Date().toISOString());
    formData.append('durationMs', 10000);

    const res = await fetch(
      `/api/v1/recordings/chunk/${this.sessionId}/webcam/${this.chunkIndex}`,
      {
        method: 'POST',
        body: formData,
      },
    );
    this.chunkIndex++;
    return await res.json();
  }

  async logViolation(type, questionId = null, meta = null) {
    return await fetch('/api/v1/violations/log', {
      method: 'POST',
      body: JSON.stringify({ sessionId: this.sessionId, type, questionId, meta }),
    });
  }

  async ping() {
    return await fetch('/api/v1/recordings/ping', {
      method: 'POST',
      body: JSON.stringify({ sessionId: this.sessionId }),
    });
  }

  async endRecording(type = 'webcam') {
    const res = await fetch('/api/v1/recordings/end', {
      method: 'POST',
      body: JSON.stringify({ sessionId: this.sessionId, type }),
    });
    return await res.json();
  }

  async endSession() {
    const res = await fetch('/api/v1/session/end', {
      method: 'POST',
      body: JSON.stringify({ sessionId: this.sessionId }),
    });
    return await res.json();
  }
}

// Usage
const antiCheat = new AntiCheatSession('cand-uuid', 'job-uuid');
await antiCheat.startSession();
await antiCheat.startRecording('webcam');

// Recording loop (every 10 seconds)
setInterval(() => {
  const chunk = captureWebcamFrame(); // Your implementation
  antiCheat.uploadChunk(chunk);
}, 10000);

// Violation detection
detectTabSwitch(() => antiCheat.logViolation('tab_switch'));
detectFaceNotPresent(() => antiCheat.logViolation('face_not_detected'));

// Keep alive
setInterval(() => antiCheat.ping(), 30000);

// When assessment ends
onAssessmentComplete(async () => {
  await antiCheat.endRecording('webcam');
  await antiCheat.endSession();
});
```

---

## Error Handling

| Error                 | Cause                           | Solution                                            |
| --------------------- | ------------------------------- | --------------------------------------------------- |
| Session not found     | Invalid sessionId               | Ensure sessionId is correct and session was started |
| Session not active    | Session ended or timed out      | Create a new session                                |
| No active recording   | Recording wasn't started        | Start recording before uploading chunks             |
| Grace period exceeded | Uploadng >60s after session end | Complete uploads sooner                             |
| Checksum mismatch     | Corrupted chunk                 | Retransmit chunk                                    |

---

## Best Practices

✅ **Do:**

- Start session before recording
- Upload chunks in sequential order
- Send pings every 30 seconds
- Log violations immediately when detected
- End recording before ending session
- Keep SSE connection alive during assessment

❌ **Don't:**

- Upload chunks out of order
- Wait too long between chunk uploads (causes gaps)
- Ignore violations
- End session without ending recordings
- Assume session stays active without pings

---

## Database Tables Created

```sql
CREATE TABLE sessions (
  id UUID PRIMARY KEY,
  candidate_id VARCHAR,
  job_id UUID,
  started_at TIMESTAMP DEFAULT NOW(),
  ended_at TIMESTAMP,
  status VARCHAR DEFAULT 'active'
);

CREATE TABLE recordings (
  id SERIAL PRIMARY KEY,
  session_id UUID REFERENCES sessions(id),
  type VARCHAR,
  status VARCHAR DEFAULT 'streaming',
  started_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  file_path VARCHAR,
  total_chunks INT DEFAULT 0
);

CREATE TABLE chunks (
  id SERIAL PRIMARY KEY,
  recording_id INT REFERENCES recordings(id),
  chunk_index INT,
  file_path VARCHAR,
  size_bytes INT,
  checksum VARCHAR,
  timestamp TIMESTAMP DEFAULT NOW(),
  client_timestamp TIMESTAMP
);

CREATE TABLE violations (
  id SERIAL PRIMARY KEY,
  session_id UUID REFERENCES sessions(id),
  type VARCHAR,
  question_id UUID,
  timestamp TIMESTAMP DEFAULT NOW(),
  meta JSONB
);
```

---

## Summary

The Anti-Cheat workflow follows this pattern:

1. **Initialize** → Start session with candidate info
2. **Monitor** → Simultaneously record and detect violations
3. **Upload** → Continuously send chunks with integrity checks
4. **Keep Alive** → Regular pings to maintain session
5. **Finalize** → End recording and session when assessment completes
6. **Review** → Retrieve all violations and recording for analysis

This ensures comprehensive monitoring with real-time uploads and no data loss.

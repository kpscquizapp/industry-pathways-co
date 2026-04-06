import { useState } from 'react'

/* ═══════════════════════════════════════════
   QuickRekruit Registration — 3-Step Form
   Matching quickrekruit.framer.website style
   ═══════════════════════════════════════════ */

const STEPS = ['ACCOUNT', 'PROFILE', 'PREFERENCES']

export default function Registration() {
  const [step, setStep] = useState(0)
  const [dir, setDir] = useState(1) // 1=forward, -1=back
  const [skills, setSkills] = useState([])
  const [skillInput, setSkillInput] = useState('')
  const [workType, setWorkType] = useState('Remote')
  const [terms, setTerms] = useState(false)
  const [privacy, setPrivacy] = useState(false)

  const goNext = () => { setDir(1); setStep(s => Math.min(s + 1, 2)) }
  const goBack = () => { setDir(-1); setStep(s => Math.max(s - 1, 0)) }

  const addSkill = () => {
    const val = skillInput.trim()
    if (val && !skills.includes(val)) {
      setSkills([...skills, val])
      setSkillInput('')
    }
  }

  const removeSkill = (s) => setSkills(skills.filter(x => x !== s))

  return (
    <div className="reg-root">
      {/* ═══ LEFT PANEL — Dark branded side ═══ */}
      <div className="reg-left">
        {/* Logo */}
        <div className="reg-logo">
          <svg width="20" height="22" viewBox="0 0 20 22" fill="none">
            <circle cx="10" cy="10" r="9" stroke="#5CE1E6" strokeWidth="2.2" fill="none" />
            <line x1="15" y1="17" x2="19" y2="21" stroke="#5CE1E6" strokeWidth="2.2" strokeLinecap="round" />
            <circle cx="10" cy="7.5" r="2.5" fill="#5CE1E6" />
            <path d="M5.5 15.5C5.5 12.5 7 11 10 11C13 11 14.5 12.5 14.5 15.5" stroke="#5CE1E6" strokeWidth="1.8" fill="none" strokeLinecap="round" />
          </svg>
          <span>QuickRekruit</span>
        </div>

        {/* Heading */}
        <div className="reg-left-content">
          <h1>
            Ready to hire your <span className="cyan">next star?</span>
          </h1>
          <p className="reg-left-sub">
            Join the ecosystem of elite contractors and find the perfect match for your career trajectory.
          </p>

          {/* Bullet points */}
          <div className="reg-bullets">
            {[
              'Access to top-tier opportunities',
              'Build your professional network',
              'Streamlined hiring process',
            ].map((item, i) => (
              <div key={i} className="reg-bullet">
                <span className="reg-bullet-dot" />
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* Decorative dots */}
        <div className="reg-dots">
          {[...Array(25)].map((_, i) => (
            <div key={i} className="reg-dot" />
          ))}
        </div>
      </div>

      {/* ═══ RIGHT PANEL — Form ═══ */}
      <div className="reg-right">
        <div className="reg-form-container">
          {/* ═══ STEPPER ═══ */}
          <Stepper currentStep={step} />

          {/* ═══ FORM CONTENT ═══ */}
          <div className="reg-step-wrapper" key={`${step}-${dir}`}>
            {step === 0 && <StepAccount />}
            {step === 1 && (
              <StepProfile
                skills={skills}
                skillInput={skillInput}
                setSkillInput={setSkillInput}
                addSkill={addSkill}
                removeSkill={removeSkill}
              />
            )}
            {step === 2 && (
              <StepPreferences
                workType={workType}
                setWorkType={setWorkType}
                terms={terms}
                setTerms={setTerms}
                privacy={privacy}
                setPrivacy={setPrivacy}
              />
            )}
          </div>

          {/* ═══ BUTTONS ═══ */}
          <div className="reg-buttons">
            {step > 0 && (
              <button className="reg-btn-back" onClick={goBack}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                Back
              </button>
            )}
            {step < 2 ? (
              <button className="reg-btn-next" onClick={goNext}>
                {step === 0 ? 'Next' : 'Next Step'}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            ) : (
              <button className="reg-btn-signup" onClick={() => alert('Registration complete!')}>
                Signup
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>

          {/* Footer link */}
          <p className="reg-footer-link">
            Already an elite contractor? <a href="#">Sign In to Dashboard</a>
          </p>
        </div>
      </div>

      <style>{styles}</style>
    </div>
  )
}

/* ═══════════════ STEPPER ═══════════════ */
function Stepper({ currentStep }) {
  return (
    <div className="stepper">
      {STEPS.map((label, i) => (
        <div key={i} className="stepper-item">
          {/* Circle */}
          <div className={`stepper-circle ${
            i < currentStep ? 'completed' : i === currentStep ? 'active' : 'pending'
          }`}>
            {i < currentStep ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : (
              <span>{i + 1}</span>
            )}
          </div>

          {/* Label */}
          <span className={`stepper-label ${i <= currentStep ? 'active-label' : ''}`}>
            {label}
          </span>

          {/* Connector line */}
          {i < STEPS.length - 1 && (
            <div className="stepper-line-wrap">
              <div className={`stepper-line ${i < currentStep ? 'filled' : ''}`} />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

/* ═══════════════ STEP 1: ACCOUNT ═══════════════ */
function StepAccount() {
  return (
    <div className="step-content">
      <h2>Create Account</h2>
      <p className="step-desc">Enter your details below to create your professional account.</p>

      <div className="form-row">
        <FormField label="First Name" placeholder="First Name" />
        <FormField label="Last Name" placeholder="Last Name" />
      </div>
      <FormField label="Email" placeholder="Email" type="email" />
      <FormField label="Mobile Number" placeholder="Mobile Number" type="tel" />
      <div className="form-row">
        <FormField label="Password" placeholder="Password" type="password" />
        <FormField label="Confirm Password" placeholder="Confirm Password" type="password" />
      </div>
    </div>
  )
}

/* ═══════════════ STEP 2: PROFILE ═══════════════ */
function StepProfile({ skills, skillInput, setSkillInput, addSkill, removeSkill }) {
  return (
    <div className="step-content">
      <h2>Professional Profile</h2>
      <p className="step-desc">Tell us about your skills and experience.</p>

      <div className="form-row">
        <div className="form-field">
          <label>CONTRACTOR TYPE *</label>
          <select className="form-select">
            <option>Full-Time Job Seeker</option>
            <option>Part-Time Contractor</option>
            <option>Freelancer</option>
          </select>
        </div>
        <FormField label="YEARS OF EXPERIENCE *" placeholder="E.g. 5" type="number" />
      </div>

      <FormField label="PRIMARY JOB ROLE *" placeholder="e.g. Full Stack Developer, Data Scientist" />

      <div className="form-field">
        <label>PRIMARY SKILLS * (PRESS ENTER TO ADD)</label>
        <div className="skill-input-wrap">
          <input
            className="form-input skill-input"
            placeholder="Type skill and press Enter..."
            value={skillInput}
            onChange={e => setSkillInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill() } }}
          />
          <button className="skill-enter-btn" onClick={addSkill}>Enter</button>
        </div>
        {skills.length > 0 ? (
          <div className="skill-tags">
            {skills.map(s => (
              <span key={s} className="skill-tag">
                {s}
                <button onClick={() => removeSkill(s)} className="skill-tag-x">×</button>
              </span>
            ))}
          </div>
        ) : (
          <p className="skill-hint">No skills added yet. Add at least one skill to continue.</p>
        )}
      </div>
    </div>
  )
}

/* ═══════════════ STEP 3: PREFERENCES ═══════════════ */
function StepPreferences({ workType, setWorkType, terms, setTerms, privacy, setPrivacy }) {
  return (
    <div className="step-content">
      <h2>Career Preferences</h2>
      <p className="step-desc">Finalize your settings and join the ecosystem.</p>

      <div className="form-field">
        <label>AVAILABILITY TO JOIN *</label>
        <select className="form-select">
          <option>Immediate / Serving Notice</option>
          <option>Immediate</option>
          <option>2 Weeks Notice</option>
          <option>1 Month Notice</option>
          <option>3 Months Notice</option>
        </select>
      </div>

      <div className="form-field">
        <label>PREFERRED WORK TYPE *</label>
        <div className="work-type-pills">
          {['Remote', 'Hybrid', 'Onsite'].map(wt => (
            <button
              key={wt}
              className={`work-pill ${workType === wt ? 'active' : ''}`}
              onClick={() => setWorkType(wt)}
            >
              {wt}
            </button>
          ))}
        </div>
      </div>

      <div className="form-field checkbox-group">
        <label className="checkbox-label">
          <input type="checkbox" checked={terms} onChange={e => setTerms(e.target.checked)} />
          <span className="checkmark" />
          I accept the <a href="#">Terms of Service</a> and agree to communications.
        </label>
        <label className="checkbox-label">
          <input type="checkbox" checked={privacy} onChange={e => setPrivacy(e.target.checked)} />
          <span className="checkmark" />
          I agree to the <a href="#">Privacy Policy</a> and data processing.
        </label>
      </div>
    </div>
  )
}

/* ═══════════════ FORM FIELD ═══════════════ */
function FormField({ label, placeholder, type = 'text' }) {
  return (
    <div className="form-field">
      <label>{label}</label>
      <input className="form-input" type={type} placeholder={placeholder} />
    </div>
  )
}

/* ═══════════════════════════════════════════
   STYLES
   ═══════════════════════════════════════════ */
const styles = `
.reg-root {
  display: flex;
  min-height: 100vh;
  font-family: 'Inter', sans-serif;
  background: #fff;
}

/* ═══ LEFT PANEL ═══ */
.reg-left {
  width: 42%;
  min-width: 340px;
  background: #111;
  color: #fff;
  padding: 36px 40px;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}

.reg-logo {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 60px;
}

.reg-logo span {
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 17px;
  color: #fff;
}

.reg-left-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.reg-left h1 {
  font-family: 'Inter', sans-serif;
  font-weight: 800;
  font-size: clamp(28px, 3vw, 38px);
  line-height: 1.15;
  letter-spacing: -0.5px;
  margin: 0 0 18px;
}

.reg-left h1 .cyan {
  color: #5CE1E6;
}

.reg-left-sub {
  font-size: 14px;
  color: #888;
  line-height: 1.6;
  margin: 0 0 32px;
  max-width: 300px;
}

.reg-bullets {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.reg-bullet {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 13.5px;
  color: #ccc;
  font-weight: 500;
}

.reg-bullet-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #5CE1E6;
  flex-shrink: 0;
}

/* Decorative dots */
.reg-dots {
  position: absolute;
  right: -10px;
  top: 50%;
  transform: translateY(-50%);
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
  opacity: 0.15;
}

.reg-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #5CE1E6;
}

/* ═══ RIGHT PANEL ═══ */
.reg-right {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 24px;
  overflow-y: auto;
}

.reg-form-container {
  width: 100%;
  max-width: 520px;
}

/* ═══ STEPPER ═══ */
.stepper {
  display: flex;
  align-items: center;
  margin-bottom: 32px;
}

.stepper-item {
  display: flex;
  align-items: center;
  flex: 1;
}

.stepper-item:last-child {
  flex: 0;
}

.stepper-circle {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 700;
  flex-shrink: 0;
  transition: all 0.35s ease;
}

.stepper-circle.completed {
  background: #10b981;
  color: #fff;
}

.stepper-circle.active {
  background: #10b981;
  color: #fff;
  box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.15);
}

.stepper-circle.pending {
  background: #f0f0f0;
  color: #aaa;
}

.stepper-label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: #ccc;
  position: absolute;
  margin-top: 52px;
  white-space: nowrap;
  transform: translateX(-25%);
}

.stepper-label.active-label {
  color: #555;
}

.stepper-item {
  position: relative;
}

.stepper-line-wrap {
  flex: 1;
  height: 3px;
  background: #eee;
  margin: 0 8px;
  border-radius: 3px;
  overflow: hidden;
}

.stepper-line {
  height: 100%;
  width: 0%;
  background: #10b981;
  border-radius: 3px;
  transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.stepper-line.filled {
  width: 100%;
}

/* ═══ STEP CONTENT ═══ */
.reg-step-wrapper {
  animation: stepIn 0.35s ease both;
}

@keyframes stepIn {
  from { opacity: 0; transform: translateX(20px); }
  to { opacity: 1; transform: translateX(0); }
}

.step-content h2 {
  font-family: 'Inter', sans-serif;
  font-weight: 800;
  font-size: 26px;
  color: #1a1a1a;
  letter-spacing: -0.5px;
  margin: 0 0 6px;
}

.step-desc {
  font-size: 14px;
  color: #999;
  margin: 0 0 24px;
  line-height: 1.5;
}

/* ═══ FORM FIELDS ═══ */
.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.form-field {
  margin-bottom: 16px;
}

.form-field label {
  display: block;
  font-size: 11px;
  font-weight: 700;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 6px;
}

.form-input {
  width: 100%;
  padding: 11px 14px;
  border: 1.5px solid #e5e5e5;
  border-radius: 10px;
  font-size: 14px;
  font-family: 'Inter', sans-serif;
  color: #1a1a1a;
  background: #fff;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-input:focus {
  border-color: #5CE1E6;
  box-shadow: 0 0 0 3px rgba(92, 225, 230, 0.1);
}

.form-input::placeholder {
  color: #ccc;
}

.form-select {
  width: 100%;
  padding: 11px 14px;
  border: 1.5px solid #e5e5e5;
  border-radius: 10px;
  font-size: 14px;
  font-family: 'Inter', sans-serif;
  color: #1a1a1a;
  background: #fff;
  outline: none;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 14px center;
  cursor: pointer;
  transition: border-color 0.2s;
}

.form-select:focus {
  border-color: #5CE1E6;
  box-shadow: 0 0 0 3px rgba(92, 225, 230, 0.1);
}

/* ═══ SKILL INPUT ═══ */
.skill-input-wrap {
  display: flex;
  gap: 8px;
}

.skill-input {
  flex: 1;
}

.skill-enter-btn {
  padding: 0 18px;
  border: 1.5px solid #1a1a1a;
  border-radius: 10px;
  background: #fff;
  font-size: 13px;
  font-weight: 600;
  color: #1a1a1a;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
  transition: all 0.2s;
}

.skill-enter-btn:hover {
  background: #1a1a1a;
  color: #fff;
}

.skill-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
}

.skill-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  background: #e8fafb;
  border: 1px solid #b2eff2;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  color: #0c7792;
}

.skill-tag-x {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  color: #0c7792;
  padding: 0;
  line-height: 1;
  opacity: 0.6;
  transition: opacity 0.15s;
}

.skill-tag-x:hover {
  opacity: 1;
}

.skill-hint {
  font-size: 12px;
  color: #bbb;
  margin-top: 8px;
  font-style: italic;
}

/* ═══ WORK TYPE PILLS ═══ */
.work-type-pills {
  display: flex;
  gap: 8px;
}

.work-pill {
  padding: 9px 22px;
  border: 1.5px solid #e5e5e5;
  border-radius: 999px;
  background: #fff;
  font-size: 13px;
  font-weight: 600;
  color: #888;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
  transition: all 0.25s;
}

.work-pill:hover {
  border-color: #ccc;
  color: #555;
}

.work-pill.active {
  background: #111;
  border-color: #111;
  color: #fff;
}

/* ═══ CHECKBOXES ═══ */
.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.checkbox-label {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 13px;
  color: #666;
  cursor: pointer;
  line-height: 1.4;
  font-weight: 500;
}

.checkbox-label input[type="checkbox"] {
  display: none;
}

.checkmark {
  width: 18px;
  height: 18px;
  border: 2px solid #ddd;
  border-radius: 5px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  margin-top: 1px;
}

.checkbox-label input:checked + .checkmark {
  background: #10b981;
  border-color: #10b981;
}

.checkbox-label input:checked + .checkmark::after {
  content: '✓';
  color: #fff;
  font-size: 11px;
  font-weight: 700;
}

.checkbox-label a {
  color: #0ea5e9;
  text-decoration: underline;
  font-weight: 600;
}

/* ═══ BUTTONS ═══ */
.reg-buttons {
  display: flex;
  gap: 12px;
  margin-top: 28px;
}

.reg-btn-next,
.reg-btn-signup {
  flex: 1;
  padding: 13px 24px;
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.25s;
}

.reg-btn-next {
  background: #10b981;
  color: #fff;
}

.reg-btn-next:hover {
  background: #059669;
  transform: translateY(-1px);
}

.reg-btn-signup {
  background: #10b981;
  color: #fff;
}

.reg-btn-signup:hover {
  background: #059669;
  transform: translateY(-1px);
}

.reg-btn-back {
  padding: 13px 20px;
  border: 1.5px solid #e5e5e5;
  border-radius: 12px;
  background: #fff;
  font-size: 14px;
  font-weight: 600;
  color: #666;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s;
}

.reg-btn-back:hover {
  border-color: #ccc;
  color: #333;
}

/* ═══ FOOTER LINK ═══ */
.reg-footer-link {
  text-align: center;
  font-size: 13px;
  color: #bbb;
  margin-top: 20px;
}

.reg-footer-link a {
  color: #0ea5e9;
  text-decoration: underline;
  font-weight: 600;
}

/* ═══ RESPONSIVE ═══ */
@media (max-width: 768px) {
  .reg-root {
    flex-direction: column;
  }
  .reg-left {
    width: 100%;
    min-width: unset;
    padding: 28px 24px;
    min-height: auto;
  }
  .reg-left-content {
    justify-content: flex-start;
  }
  .reg-left h1 {
    font-size: 26px;
  }
  .reg-dots {
    display: none;
  }
  .reg-right {
    padding: 24px 20px;
  }
  .form-row {
    grid-template-columns: 1fr;
  }
  .stepper-label {
    font-size: 8px;
    letter-spacing: 1px;
  }
}
`

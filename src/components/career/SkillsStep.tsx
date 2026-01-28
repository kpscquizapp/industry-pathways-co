
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface SkillCategory {
  id: string;
  name: string;
  skills: string[];
}

interface SkillsStepProps {
  selectedSkills: string[];
  setSelectedSkills: (skills: string[]) => void;
  onNext: () => void;
  onBack: () => void;
}

const skillCategories: SkillCategory[] = [
  {
    id: 'programming',
    name: 'Programming Languages',
    skills: [
      'Python', 'JavaScript', 'Java', 'C#', 'C++', 'PHP', 'Ruby', 'Swift', 
      'Kotlin', 'Go', 'Rust', 'Scala', 'R', 'MATLAB', 'TypeScript',
      'Dart', 'Perl', 'Haskell', 'Objective-C', 'Assembly', 'Groovy',
      'Lua', 'Clojure', 'F#', 'COBOL', 'Fortran', 'Erlang', 'Julia'
    ]
  },
  {
    id: 'web',
    name: 'Web Development',
    skills: [
      'React', 'Angular', 'Vue.js', 'Node.js', 'Express.js', 'Django', 'Flask', 
      'HTML', 'CSS', 'jQuery', 'Bootstrap', 'Tailwind CSS', 'Next.js', 'Svelte',
      'GraphQL', 'REST API', 'WebSockets', 'Redux', 'Gatsby', 'Webpack',
      'SASS/SCSS', 'Ember.js', 'Three.js', 'D3.js', 'Material UI', 'Chakra UI',
      'TypeORM', 'Prisma', 'Vite', 'Laravel', 'Ruby on Rails', 'Spring Boot'
    ]
  },
  {
    id: 'devops',
    name: 'DevOps & Cloud',
    skills: [
      'Docker', 'Kubernetes', 'AWS', 'Azure', 'Google Cloud', 'Jenkins', 'GitLab CI/CD',
      'Terraform', 'Ansible', 'Puppet', 'Chef', 'CircleCI', 'Travis CI', 'GitHub Actions',
      'Linux', 'Bash', 'PowerShell', 'Nginx', 'Apache', 'Prometheus', 'Grafana',
      'Microservices', 'Serverless', 'ELK Stack', 'Redis', 'RabbitMQ', 'Kafka'
    ]
  }
];

const SkillsStep = ({ selectedSkills, setSelectedSkills, onNext, onBack }: SkillsStepProps) => {
  const { translations } = useLanguage();
  
  const handleSkillToggle = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-8 animate-in fade-in duration-300">
      <h2 className="text-2xl font-semibold text-neutral-800 mb-6">
        {translations.selectYourSkills}
      </h2>

      <div className="space-y-8">
        {skillCategories.map((category) => (
          <div key={category.id} className="space-y-4">
            <h3 className="text-base font-medium text-neutral-700 flex items-center">
              <span className="inline-flex items-center justify-center w-5 h-5 bg-teal-100 rounded-md text-teal-600 mr-2 text-xs">
                {category.id === 'programming' ? '<>' : category.id === 'web' ? 'W' : 'D'}
              </span>
              {category.name}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {category.skills.map((skill) => (
                <div key={skill} className="flex items-center space-x-2 border p-3 rounded-lg hover:bg-neutral-50">
                  <Checkbox
                    id={`skill-${skill}`}
                    checked={selectedSkills.includes(skill)}
                    onCheckedChange={() => handleSkillToggle(skill)}
                  />
                  <Label
                    htmlFor={`skill-${skill}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {skill}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={onBack}>
          {translations.back}
        </Button>
        <Button 
          onClick={onNext} 
          disabled={selectedSkills.length === 0}
        >
          {translations.viewCareerPaths}
        </Button>
      </div>
    </div>
  );
};

export default SkillsStep;

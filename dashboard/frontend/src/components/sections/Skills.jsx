/**
 * Skills Component - Phase 2
 * Displays skills by category with proficiency levels
 */

export default function Skills({ skills }) {
  if (!skills || skills.length === 0) {
    return null;
  }

  // Group skills by category
  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {});

  const categoryConfig = {
    technical: {
      title: '💻 Compétences Techniques',
      color: 'blue',
      icon: '💻'
    },
    business: {
      title: '💼 Compétences Business',
      color: 'green',
      icon: '💼'
    },
    soft: {
      title: '🤝 Soft Skills',
      color: 'purple',
      icon: '🤝'
    },
    tools: {
      title: '🛠️ Outils & Technologies',
      color: 'yellow',
      icon: '🛠️'
    }
  };

  return (
    <section id="skills" className="py-16 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Compétences
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Mon profil hybride Tech + Business
          </p>
        </div>

        {/* Skills Overview Card */}
        <div className="max-w-4xl mx-auto mb-12 p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-lg shadow-lg">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {skills.filter(s => s.category === 'technical').length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                Skills Tech
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                {skills.filter(s => s.category === 'business').length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                Skills Business
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                {skills.filter(s => s.is_primary).length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                Compétences Principales
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                {Math.round(skills.reduce((sum, s) => sum + (s.years_experience || 0), 0) / skills.length)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                Années Moy.
              </div>
            </div>
          </div>
        </div>

        {/* Skills by Category */}
        <div className="max-w-6xl mx-auto space-y-8">
          {Object.entries(groupedSkills).map(([category, categorySkills]) => (
            <SkillCategory
              key={category}
              category={category}
              skills={categorySkills.sort((a, b) => b.proficiency_level - a.proficiency_level)}
              config={categoryConfig[category] || { title: category, color: 'gray', icon: '📦' }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function SkillCategory({ category, skills, config }) {
  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow-lg p-6">
      {/* Category Header */}
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
        <span>{config.icon}</span>
        <span>{config.title}</span>
      </h3>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {skills.map((skill) => (
          <SkillCard key={skill.id} skill={skill} color={config.color} />
        ))}
      </div>
    </div>
  );
}

function SkillCard({ skill, color }) {
  // Calculate proficiency percentage
  const proficiencyPercentage = (skill.proficiency_level / 5) * 100;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg p-4 hover:shadow-md transition-shadow">
      {/* Skill Name & Primary Badge */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <h4 className="font-bold text-gray-900 dark:text-white">
            {skill.name}
          </h4>
          {skill.subcategory && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {skill.subcategory}
            </p>
          )}
        </div>
        {skill.is_primary && (
          <span className={`ml-2 px-2 py-1 bg-${color}-100 dark:bg-${color}-900 text-${color}-800 dark:text-${color}-200 text-xs font-medium rounded`}>
            ⭐
          </span>
        )}
      </div>

      {/* Proficiency Bar */}
      <div className="mb-2">
        <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
          <span>Niveau</span>
          <span>{skill.proficiency_level}/5</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className={`bg-${color}-500 h-2 rounded-full transition-all duration-500`}
            style={{ width: `${proficiencyPercentage}%` }}
          />
        </div>
      </div>

      {/* Years of Experience */}
      {skill.years_experience > 0 && (
        <div className="text-xs text-gray-600 dark:text-gray-400">
          🕒 {skill.years_experience} an{skill.years_experience > 1 ? 's' : ''} d'expérience
        </div>
      )}
    </div>
  );
}

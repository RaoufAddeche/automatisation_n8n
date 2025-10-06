/**
 * Testimonials Component - Phase 2
 * Displays client and colleague testimonials
 */

export default function Testimonials({ testimonials }) {
  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  return (
    <section id="testimonials" className="py-16 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Témoignages
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Ce que disent mes collaborateurs, managers, et clients
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({ testimonial }) {
  const relationshipColors = {
    manager: 'blue',
    colleague: 'green',
    client: 'purple',
    mentor: 'yellow'
  };

  const relationshipLabels = {
    manager: '👔 Manager',
    colleague: '👥 Collègue',
    client: '💼 Client',
    mentor: '🎓 Mentor'
  };

  const color = relationshipColors[testimonial.relationship] || 'gray';

  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-300 flex flex-col">
      {/* Quote */}
      <div className="flex-1 mb-4">
        <div className="text-4xl text-gray-300 dark:text-gray-600 mb-2">"</div>
        <p className="text-gray-700 dark:text-gray-300 italic leading-relaxed">
          {testimonial.quote}
        </p>
        <div className="text-4xl text-gray-300 dark:text-gray-600 text-right">"</div>
      </div>

      {/* Rating */}
      {testimonial.rating && (
        <div className="flex items-center gap-1 mb-4">
          {[...Array(5)].map((_, i) => (
            <span key={i} className={i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}>
              ⭐
            </span>
          ))}
        </div>
      )}

      {/* Author Info */}
      <div className="flex items-center gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        {/* Avatar or Initials */}
        {testimonial.author_photo_url ? (
          <img
            src={testimonial.author_photo_url}
            alt={testimonial.author_name}
            className="w-12 h-12 rounded-full object-cover"
          />
        ) : (
          <div className={`w-12 h-12 rounded-full bg-${color}-500 flex items-center justify-center text-white font-bold`}>
            {testimonial.author_name.split(' ').map(n => n[0]).join('')}
          </div>
        )}

        {/* Author Details */}
        <div className="flex-1">
          <div className="font-bold text-gray-900 dark:text-white">
            {testimonial.author_name}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {testimonial.author_title}
          </div>
          {testimonial.author_company && (
            <div className="text-xs text-gray-500 dark:text-gray-500">
              {testimonial.author_company}
            </div>
          )}
        </div>

        {/* LinkedIn Link */}
        {testimonial.author_linkedin_url && (
          <a
            href={testimonial.author_linkedin_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
            </svg>
          </a>
        )}
      </div>

      {/* Relationship & Context */}
      <div className="mt-4 flex items-center justify-between text-xs">
        {testimonial.relationship && (
          <span className={`px-2 py-1 bg-${color}-100 dark:bg-${color}-900 text-${color}-800 dark:text-${color}-200 rounded`}>
            {relationshipLabels[testimonial.relationship] || testimonial.relationship}
          </span>
        )}
        {testimonial.date_given && (
          <span className="text-gray-500 dark:text-gray-400">
            {new Date(testimonial.date_given).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })}
          </span>
        )}
      </div>

      {/* Project Context */}
      {testimonial.project_context && (
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 italic">
          Projet: {testimonial.project_context}
        </div>
      )}
    </div>
  );
}

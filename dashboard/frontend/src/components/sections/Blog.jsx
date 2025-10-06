/**
 * Blog Component - Phase 2
 * Displays featured blog posts
 */

export default function Blog({ posts }) {
  if (!posts || posts.length === 0) {
    return null;
  }

  return (
    <section id="blog" className="py-16 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Articles & Insights
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Réflexions sur la Data Science, le Machine Learning, et la reconversion professionnelle
          </p>
        </div>

        {/* Blog Posts Grid */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}

function BlogCard({ post }) {
  const categoryColors = {
    tutorial: 'blue',
    case_study: 'green',
    opinion: 'purple',
    technical: 'red'
  };

  const categoryLabels = {
    tutorial: '📚 Tutorial',
    case_study: '💼 Case Study',
    opinion: '💭 Opinion',
    technical: '⚙️ Technical'
  };

  const color = categoryColors[post.category] || 'gray';

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <article className="bg-white dark:bg-gray-900 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
      {/* Cover Image or Gradient */}
      {post.cover_image_url ? (
        <img
          src={post.cover_image_url}
          alt={post.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
      ) : (
        <div className={`w-full h-48 bg-gradient-to-br from-${color}-400 to-${color}-600 flex items-center justify-center`}>
          <span className="text-6xl">
            {post.is_featured && '⭐'}
            {!post.is_featured && categoryLabels[post.category]?.split(' ')[0]}
          </span>
        </div>
      )}

      <div className="p-6">
        {/* Category & Read Time */}
        <div className="flex items-center justify-between mb-3">
          <span className={`px-2 py-1 bg-${color}-100 dark:bg-${color}-900 text-${color}-800 dark:text-${color}-200 text-xs font-medium rounded`}>
            {categoryLabels[post.category] || post.category}
          </span>
          {post.read_time_minutes && (
            <span className="text-sm text-gray-500 dark:text-gray-400">
              ⏱️ {post.read_time_minutes} min
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {post.title}
        </h3>

        {/* Excerpt */}
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
          {post.excerpt}
        </p>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.slice(0, 3).map((tag, i) => (
              <span
                key={i}
                className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {formatDate(post.published_at)}
          </span>
          <button className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium">
            Lire →
          </button>
        </div>

        {/* Stats (if featured) */}
        {post.is_featured && post.view_count > 0 && (
          <div className="mt-3 flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
            <span>👁️ {post.view_count} vues</span>
            {post.like_count > 0 && <span>❤️ {post.like_count}</span>}
          </div>
        )}
      </div>
    </article>
  );
}

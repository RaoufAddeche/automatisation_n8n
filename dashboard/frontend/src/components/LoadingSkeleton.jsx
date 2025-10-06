import React from 'react'

const SkeletonCard = () => (
  <div className="card p-6 animate-pulse">
    <div className="flex justify-between items-start mb-4">
      <div className="flex-1">
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full mb-1"></div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
      </div>
      <div className="ml-4 flex flex-col items-end space-y-2">
        <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
      </div>
    </div>

    <div className="flex flex-wrap gap-2 mb-4">
      <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
      <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
      <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-14"></div>
    </div>

    <div className="flex items-center justify-between text-sm mb-4">
      <div className="flex items-center space-x-4">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-8"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-8"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
      </div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
    </div>

    <div className="flex justify-between items-center">
      <div className="flex space-x-2">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
      </div>
      <div className="flex space-x-2">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4"></div>
      </div>
    </div>
  </div>
)

const SkeletonStats = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    {[...Array(4)].map((_, index) => (
      <div key={index} className="card p-6 animate-pulse">
        <div className="flex items-center">
          <div className="p-3 bg-gray-200 dark:bg-gray-700 rounded-xl w-12 h-12"></div>
          <div className="ml-4 flex-1">
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20 mb-2"></div>
            <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-12"></div>
          </div>
        </div>
      </div>
    ))}
  </div>
)

const LoadingSkeleton = () => (
  <div className="min-h-screen content-bg">
    <header className="header-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div>
            <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-64 mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48"></div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-8"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
          </div>
        </div>
      </div>
    </header>

    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <SkeletonStats />

      <div className="card p-6 mb-6 animate-pulse">
        <div className="flex flex-wrap gap-4">
          <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
          <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
          <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    </main>
  </div>
)

export default LoadingSkeleton
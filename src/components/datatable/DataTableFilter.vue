<template>
  <div class="mb-6">
    <label for="email" class="block text-sm font-medium leading-5 text-gray-700">Search</label>
    <div class="flex mt-1 rounded-md shadow-sm">
      <div class="relative flex-grow focus-within:z-10">
        <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <!-- Heroicon name: users -->
          <svg class="w-5 h-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
            <path
              d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"
            />
          </svg>
        </div>
        <input
          id="email"
          class="block w-full pl-10 transition duration-150 ease-in-out rounded-none form-input rounded-l-md sm:text-sm sm:leading-5"
        />
      </div>
      <button
        class="relative inline-flex items-center px-4 py-2 -ml-px text-sm font-medium leading-5 text-gray-700 transition duration-150 ease-in-out border border-gray-300 rounded-r-md bg-gray-50 hover:text-gray-500 hover:bg-white focus:outline-none focus:shadow-outline-blue focus:border-blue-300 active:bg-gray-100 active:text-gray-700"
      >
        <!-- Heroicon name: sort-ascending -->
        <svg class="w-5 h-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
          <path
            d="M3 3a1 1 0 000 2h11a1 1 0 100-2H3zM3 7a1 1 0 000 2h5a1 1 0 000-2H3zM3 11a1 1 0 100 2h4a1 1 0 100-2H3zM13 16a1 1 0 102 0v-5.586l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 101.414 1.414L13 10.414V16z"
          />
        </svg>
        <span class="ml-2">Sort</span>
      </button>
    </div>
  </div>
</template>

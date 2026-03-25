<template>
  <div class="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">

    <!-- Sidebar -->
    <aside class="w-60 shrink-0 flex flex-col bg-gray-950 text-white">
      <div class="px-5 py-6 border-b border-gray-800">
        <NuxtLink to="/" class="flex items-center gap-2 group">
          <div class="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
            <UIcon name="i-heroicons-wrench-screwdriver" class="w-4 h-4 text-white" />
          </div>
          <span class="font-semibold text-sm tracking-wide">Dev Tools</span>
        </NuxtLink>
      </div>

      <nav class="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p class="px-2 mb-2 text-xs font-medium text-gray-500 uppercase tracking-wider">Tools</p>
        <NuxtLink
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors"
          :class="route.path === link.to
            ? 'bg-gray-800 text-white'
            : 'text-gray-400 hover:bg-gray-800/60 hover:text-white'"
        >
          <UIcon :name="link.icon" class="w-4 h-4 shrink-0" />
          {{ link.label }}
        </NuxtLink>
      </nav>
    </aside>

    <!-- Main -->
    <div class="flex flex-col flex-1 min-w-0 overflow-hidden">
      <main class="flex-1 overflow-y-auto p-8">
        <slot />
      </main>
      <footer class="shrink-0 px-8 py-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <p class="text-xs text-gray-400">
          © {{ new Date().getFullYear() }} Dev Tools by
          <a href="mailto:info@svarc.dev" class="hover:text-gray-600 underline underline-offset-2">Miroslav Švarc</a>
        </p>
      </footer>
    </div>

  </div>
</template>

<script setup>
const route = useRoute()

const links = [
  { label: 'Workdays Calculator', to: '/workdays', icon: 'i-heroicons-calendar-days' },
]
</script>

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: {enabled: true},
    modules: [
        "@nuxtjs/tailwindcss",
        "@pinia/nuxt",
        "dayjs-nuxt"
    ],
    dayjs: {
        locales: ['zh', 'en'],
        plugins: ['relativeTime', 'utc', 'timezone'],
        defaultLocale: 'zh',
        defaultTimezone: 'Asia/Shanghai',
    }
})
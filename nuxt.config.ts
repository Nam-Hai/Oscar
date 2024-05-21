// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
    ssr: false,

    // nitro: {
    //     preset: "vercel",
    // },

    css: ["@/styles/core.scss", "@/styles/app/index.scss"],

    components: {
        global: true,
        dirs: [
            "~/components/lib/",
            "~/components/app/",
            "~/components/homepage/",
            "~/components/project/",
            "~/components/playground/",
        ],
    },

    app: {
        head: {
            meta: [
                {
                    name: "viewport",
                    content:
                        "width=device-width initial-scale=1 maximum-scale=1.2 user-scalable=no",
                },
                {
                    charset: "utf-8",
                },
                {
                    name: "theme-color",
                    content: "#F7F5F2",
                },
                {
                    key: "description", name: "description",
                    content: "A digital designer with over 3 years of experience, specialised in visual and interface design. Also, a lover and enthusiast of art direction and all existing forms of design. Always looking towards the future to learn new skills, like motion or 3D design."
                },
                { key: "og:title", property: "og:title", content: "Oscar Pico — Digital Designer" },
                {
                    key: "og:url",
                    property: "og:url",
                    content: `https://www.oscarpico.es`,
                },
                {
                    key: "og:description",
                    property: "og:description",
                    content: "A digital designer with over 3 years of experience, specialised in visual and interface design. Also, a lover and enthusiast of art direction and all existing forms of design. Always looking towards the future to learn new skills, like motion or 3D design.",
                },
                {
                    key: "og:image",
                    property: "og:image",
                    content: `https://www.oscarpico.es/manifest/preview.webp`,
                },
                // twitter card
                {
                    key: "twitter:title",
                    name: "twitter:title",
                    content: "Oscar Pico — Digital Designer",
                },
                {
                    key: "twitter:url",
                    name: "twitter:url",
                    content: `https://www.oscarpico.es`,
                },
                {
                    key: "twitter:description",
                    name: "twitter:description",
                    content: "Oscar Pico — Digital Designer",
                },
                {
                    key: "twitter:image",
                    name: "twitter:image",
                    content: `https://www.oscarpico.es/manifest/preview.webp`,
                },
                {
                    key: "twitter:card",
                    name: "twitter:card",
                    content: "summary",
                }
            ],
            title: "Oscar Pico — Digital Designer",
            link: [
                {
                    rel: "preload",
                    //   href: '/fonts/founders-grotesk-light.woff2',
                    href: "https://use.typekit.net/af/7b43bd/00000000000000007735e8ac/30/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n4&v=3",
                    as: "font",
                    type: "font/ttf",
                    crossorigin: "anonymous",
                },
                {
                    rel: "icon",
                    type: "image/png",
                    sizes: "32x32",
                    href: "/favicon/favicon-32x32.png",
                },
                {
                    rel: "icon",
                    type: "image/png",
                    sizes: "16x16x",
                    href: "/favicon/favicon-16x16.png",
                },
                {
                    rel: "icon",
                    type: "image/png",
                    sizes: "32x32",
                    href: "/favicon/favicon-32x32.png",
                },
                {
                    rel: "apple-touch-icon",
                    sizes: "180x180",
                    href: "/favicon/apple-touch-icon.png"
                },
            ],
            script: [
                {
                    src: 'https://static.cloudflareinsights.com/beacon.min.js',
                    defer: true,
                    "data-cf-beacon": '{"token": "9e2b52d49f8e4143b624d36aae094f29"}',
                }
            ]
        },
    },

    devtools: {
        enabled: false,
    },
});

// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
    ssr: true,

    nitro: {
        preset: "vercel",
    },
    css: ["@/styles/core.scss", "@/styles/app/index.scss"],
    components: {
        global: true,
        dirs: [
            "~/components/lib/",
            "~/components/app/",
            "~/components/homepage/",
            "~/components/project/",
            "~/components/archive/",
            "~/components/info/"
        ],
    },
    imports: {
        // dirs: ["./pages_transitions"]
    },
    ignore: [
        '~/pages/ignore/',
        '~/pages/ignore/_templatePage.transitions.ts',
    ],

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
                    content: "#000000",
                },
            ],
            title: "Oscar",
            link: [
                {
                    rel: "preload",
                    //   href: '/fonts/founders-grotesk-light.woff2',
                    href: "https://use.typekit.net/af/7b43bd/00000000000000007735e8ac/30/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n4&v=3",
                    as: "font",
                    type: "font/ttf",
                    crossorigin: "anonymous",
                },
                // {
                //     rel: "icon",
                //     type: "image/png",
                //     sizes: "32x32",
                //     href: "/favicon/favicon-32x32.png",
                //     class: "dark",
                // },
                // {
                //     rel: "icon",
                //     type: "image/png",
                //     sizes: "16x16x",
                //     href: "/favicon/favicon-16x16.png",
                //     class: "dark",
                // },
                // {
                //     rel: "icon",
                //     type: "image/png",
                //     sizes: "32x32",
                //     href: "/favicon/favicon-32x32_light.png",
                //     class: "light",
                // },
                // {
                //     rel: "icon",
                //     type: "image/png",
                //     sizes: "16x16x",
                //     href: "/favicon/favicon-16x16_light.png",
                //     class: "light",
                // },
                // {
                //     rel: "apple-touch-icon",
                //     sizes: "180x180",
                //     href: "/favicon/apple-touch-icon.png"
                // },
                // {
                //     rel: "mask-icon",
                //     href: "/favicon/safari-pinned-tab.svg",
                //     color: "#292929"
                // }
            ],
            script: [
                {
                    src: "/init.js",
                },
            ],
        },
    },
});

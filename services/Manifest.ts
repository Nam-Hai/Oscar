
import { Texture } from "ogl";

const MANIFEST = {
  home: [
    // "Asset"
    "/Assets/Home/01_Home_Viadomo.webp",
    "/Assets/Home/02_Home_AvantGarden.webp",
    "/Assets/Home/03_Home_MuchoMatcha.webp",
    "/Assets/Home/04_Home_MapfreSalud.webp",
  ],
  assets: [

  ]
};
const LAZY_MANIFEST = {
  assets: [
    "/Assets/Viadomo/output_1.webp",
    "/Assets/Viadomo/output_2.webm",
    "/Assets/Viadomo/output_3.webp",
    "/Assets/Viadomo/output_4.webp",
    "/Assets/Viadomo/output_5.webm",
    "/Assets/Viadomo/output_6.webp",
    "/Assets/Viadomo/output_7.webp",
    "/Assets/Viadomo/output_8.webp",
    "/Assets/Viadomo/output_9.webp",
    "/Assets/Viadomo/output_10.webp",
    "/Assets/Viadomo/output_11.webp",
    "/Assets/Viadomo/output_12.webp",
    "/Assets/Viadomo/output_13.webp",
    "/Assets/Viadomo/output_14.webp",

    "/Assets/Avant_Garden/output_1.webp",
    "/Assets/Avant_Garden/output_2.webp",
    "/Assets/Avant_Garden/output_3.webp",
    "/Assets/Avant_Garden/output_4.webp",
    "/Assets/Avant_Garden/output_5.webp",
    "/Assets/Avant_Garden/output_6.webp",
    "/Assets/Avant_Garden/output_7.webp",
    "/Assets/Avant_Garden/output_8.webm",
    "/Assets/Avant_Garden/output_9.webp",
    "/Assets/Avant_Garden/output_10.webp",
    "/Assets/Avant_Garden/output_11.webp",
    "/Assets/Avant_Garden/output_12.webm",
    "/Assets/Avant_Garden/output_13.webp",
    "/Assets/Avant_Garden/output_14.webp",

    "/Assets/Mucho_Matcha/output_1.webp",
    "/Assets/Mucho_Matcha/output_2.webp",
    "/Assets/Mucho_Matcha/output_3.webp",
    "/Assets/Mucho_Matcha/output_4.webm",
    "/Assets/Mucho_Matcha/output_5.webp",
    "/Assets/Mucho_Matcha/output_6.webp",
    "/Assets/Mucho_Matcha/output_7.webp",
    "/Assets/Mucho_Matcha/output_8.webm",
    "/Assets/Mucho_Matcha/output_9.webp",
    "/Assets/Mucho_Matcha/output_10.webp",
    "/Assets/Mucho_Matcha/output_11.webm",
    "/Assets/Mucho_Matcha/output_12.webp",
    "/Assets/Mucho_Matcha/output_13.webp",
    "/Assets/Mucho_Matcha/output_14.webp",

    "/Assets/Mapfre_Salud/output_1.webp",
    "/Assets/Mapfre_Salud/output_2.webm",
    "/Assets/Mapfre_Salud/output_3.webp",
    "/Assets/Mapfre_Salud/output_4.webp",
    "/Assets/Mapfre_Salud/output_5.webp",
    "/Assets/Mapfre_Salud/output_6.webp",
    "/Assets/Mapfre_Salud/output_7.webm",
    "/Assets/Mapfre_Salud/output_8.webp",
    "/Assets/Mapfre_Salud/output_9.webp",
    "/Assets/Mapfre_Salud/output_10.webp",
    "/Assets/Mapfre_Salud/output_11.webm",
  ],
  info: [
    "/Assets/info/Oscar_Pico.png"
  ]
}

class QLoader {
  queue: (() => Promise<void>)[] = []
  on = ref(false)
  constructor() {

    watch(this.on, b => {

      b && this.load()
    })
  }
  load = async () => {
    const q = this.queue.shift()
    if (!q) {
      this.on.value = false
      return
    }
    await new Promise<void>(async res => {
      await q()
      res()
    })
    this.load()
  }

  add(loader: () => Promise<void>) {
    this.queue.push(loader)
    this.on.value = true
  }
}
export default class Manifest {
  length: number;
  index: globalThis.Ref<number>;
  callback?: (n: number) => void;


  textures: {
    [key: string]: { [key: string]: Texture };
  };

  lazyTextures: {
    [src: string]: {
      getTexture(): Texture,
      loaded: Ref<boolean>
    }
  }
  jsons: { [key: string]: {} };
  percentage: Ref<number>;
  canvasContext: any;
  currentBackground: number;
  emptyTexture: Texture;
  QLoader: QLoader;

  constructor(gl: any) {
    this.canvasContext = gl;
    this.textures = {
    }
    this.lazyTextures = {
    }

    this.emptyTexture = new Texture(this.canvasContext)

    this.index = ref(0);
    this.percentage = ref(0);
    this.length = 0;

    this.jsons = {};

    this.currentBackground = 0

    this.QLoader = new QLoader()
  }

  init() {
    for (const m of Object.values(MANIFEST)) {
      this.length += Object.values(m).length;
    }
    this.length += Object.values(this.jsons).length;

    // prismic fetch
    // this.length += 1

    const { manifestLoaded } = useStore();

    const unWatch = watch(this.index, (i) => {
      this.percentage.value = i / this.length;

      i == this.length && ((manifestLoaded.value = true), unWatch());
    });


  }


  async loadManifest() {
    const { manifestLoaded } = useStore();

    this.length === 0 &&
      ((this.percentage.value = 1), (manifestLoaded.value = true));
    for (const [keys, m] of Object.entries(MANIFEST)) {
      // this.textures[keys] = [];
      this.textures[keys] = {}
      for (const src of m) {
        await new Promise<void>((res) => {
          const texture = new Texture(this.canvasContext, { format: this.canvasContext.RGB });
          const image = new Image();
          image.crossOrigin = "anonymous";

          image.onload = () => {
            texture.image = image;
            // this.textures[keys].push(texture);
            this.textures[keys][src] = texture
            this.lazyTextures[src] = {
              loaded: ref(true),
              getTexture() {
                return texture
              }
            }
            this.index.value++;
            res();
          };
          image.src = src;
        });
      }
    }
    for (const [keys, values] of Object.entries(this.jsons)) {
      const font = await (await fetch(keys)).json();
      this.jsons[keys] = font;
      this.index.value += 1;
    }

    manifestLoaded.value = true

    this.lazyLoadManifest()
  }

  async lazyLoadManifest() {
    // init Textures
    for (const [keys, m] of Object.entries(LAZY_MANIFEST)) {
      // this.lazyTextures[keys] = {}
      for (const src of m) {
        const texture = new Texture(this.canvasContext, { format: this.canvasContext.RGB });
        this.lazyTextures[src] = {
          loaded: ref(false),
          getTexture: () => {
            if (!this.lazyTextures[src].loaded.value) {
              this.QLoader.add(() => {
                return new Promise<void>(res => {

                  if (src.slice(src.length - 4, src.length) == 'webm') {
                    const video = document.createElement('video');
                    video.src = src;
                    // Disclaimer: video autoplay is a confusing, constantly-changing browser feature.
                    // The best approach is to never assume that it will work, and therefore prepare for a fallback.
                    video.loop = true;
                    video.muted = true;
                    video.setAttribute('playsinline', 'playsinline');
                    video.play();
                    const load = () => {
                      if (video.readyState >= video.HAVE_ENOUGH_DATA) {
                        video.width = video.videoWidth
                        video.height = video.videoHeight
                        texture.image = video;
                        this.lazyTextures[src].loaded.value = true
                        texture.needsUpdate = true;
                        useDelay(30, () => {
                          res()
                        })
                      } else {
                        requestAnimationFrame(load);
                      }
                    }
                    load()
                  } else {
                    const image = new Image();
                    image.crossOrigin = "anonymous";
                    image.onload = () => {
                      texture.image = image;
                      this.lazyTextures[src].loaded.value = true
                      // prevent too big chunk of memory allocation
                      useDelay(100, () => {
                        res()
                      })
                    };
                    image.src = src;
                  }
                })


              })
            }
            return texture;
          }
        }
      }
    }


    return false
    // start loading auto

    for (const [src, m] of Object.entries(this.lazyTextures)) {
      await new Promise<void>((res) => {
        if (this.lazyTextures[src].loaded.value) {
          res()
          return
        }

        const image = new Image();
        image.crossOrigin = "anonymous";

        image.onload = () => {
          if (this.lazyTextures[src].loaded.value) {
            res()
            return
          }
          // useDelay(2000, () => {
          this.lazyTextures[src].loaded.value = true
          this.lazyTextures[src].getTexture().image = image;
          res()
          // })
        };
        image.src = src;
      });
    }
  }

  getBackground() {
    this.currentBackground++
    const textures = Object.values(this.textures.home)
    if (this.currentBackground >= textures.length) {
      N.Arr.shuffle(textures)
      this.currentBackground = 0
    }
    return textures[this.currentBackground]
  }
}

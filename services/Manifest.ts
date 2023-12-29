
import { Texture } from "ogl";

const MANIFEST = {
  home: [
    // "Asset"
    "/Assets/Home1.png",
    "/Assets/Home_2.jpg",
    "/Assets/Home3.png",
  ],
  assets: [

  ]
};
const LAZY_MANIFEST = {
  assets: [
    "/Assets/Viadomo/1.jpg",
    // "/Assets/Viadomo/2.jpg",
    "/Assets/Viadomo/3.jpg",
    "/Assets/Viadomo/4.jpg",
    "/Assets/Viadomo/5.jpg",
    "/Assets/Viadomo/6.jpg",
    "/Assets/Viadomo/7.jpg",
    // "/Assets/Viadomo/8.jpg",
    "/Assets/Viadomo/9.jpg",
    "/Assets/Viadomo/10.jpg",
    "/Assets/Viadomo/11.jpg",
    // "/Assets/Viadomo/12.jpg",
    "/Assets/Viadomo/13.jpg",
    "/Assets/Viadomo/14.jpg",
    "/Assets/Viadomo/15.jpg",
    "/Assets/Viadomo/16.jpg",
    "/Assets/Viadomo/17.jpg",
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
          const texture = new Texture(this.canvasContext);
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

    this.lazyLoadManifest()
  }

  async lazyLoadManifest() {
    // init Textures
    for (const [keys, m] of Object.entries(LAZY_MANIFEST)) {
      // this.lazyTextures[keys] = {}
      for (const src of m) {
        const texture = new Texture(this.canvasContext);
        this.lazyTextures[src] = {
          loaded: ref(false),
          getTexture: () => {
            if (!this.lazyTextures[src].loaded.value) {
              this.QLoader.add(() => {
                return new Promise<void>(res => {
                  const image = new Image();
                  image.crossOrigin = "anonymous";
                  image.onload = () => {
                    texture.image = image;
                    this.lazyTextures[src].loaded.value = true
                    res()
                  };
                  image.src = src;
                })
              })
            }
            return texture;
          }
        }
      }
    }

    console.log("LAZY LOAD ==============> ", this.lazyTextures);

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

    console.log(this.lazyTextures);
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

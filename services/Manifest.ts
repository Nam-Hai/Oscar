
import { Texture } from "ogl";

const MANIFEST = {
  home: [
    // "Asset"
    "/Assets/Home1.png",
    "/Assets/Home_2.jpg",
    "/Assets/Home3.png",
  ],

};
const LAZY_MANIFEST = {
  VIADOMO: [
    "/Assets/Viadomo/1.jpg"
  ],
  junk: [
    "/junk/1.avif",
    "/junk/2.avif",
    "/junk/3.avif",
    "/junk/4.avif",
  ]
}

export default class Manifest {
  length: number;
  index: globalThis.Ref<number>;
  callback?: (n: number) => void;


  textures: {
    [key: string]: { [key: string]: Texture };
  };
  lazyTextures: {
    [key: string]: {
      [src: string]: {
        get texture(): Texture,
        loaded: Ref<boolean>
      }
    }
  }
  jsons: { [key: string]: {} };
  percentage: Ref<number>;
  canvasContext: any;
  currentBackground: number;
  emptyTexture: Texture;

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
      this.lazyTextures[keys] = {}
      for (const src of m) {
        const texture = new Texture(this.canvasContext);
        this.lazyTextures[keys][src] = {
          loaded: ref(false),
          get texture() {
            if (!this.loaded.value) {
              const image = new Image();
              image.crossOrigin = "anonymous";

              image.onload = () => {
                texture.image = image;
                this.loaded.value = true
              };
              image.src = src;
            }
            return texture;
          }
        }
      }
    }


    for (const [keys, m] of Object.entries(this.lazyTextures)) {
      for (const src of Object.keys(m)) {
        await new Promise<void>((res) => {
          if (this.lazyTextures[keys][src].loaded.value) {
            res()
            return
          }

          const image = new Image();
          image.crossOrigin = "anonymous";

          image.onload = () => {
            if (this.lazyTextures[keys][src].loaded.value) {
              res()
              return
            }
            this.lazyTextures[keys][src].loaded.value = true
            this.lazyTextures[keys][src].texture.image = image;
            res()
          };
          image.src = src;
        });
      }
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

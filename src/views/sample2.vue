<template>
  <div>
      <div ref="sample2" />
  </div>
</template>

<script>
import * as PIXI from 'pixi.js'
// import bunny from '@/assets/bunny.png'

export default {
    name: "sample2",
    data () {
        return {
            app: null
        }
    },
    mounted () {
        this.init()
    },
    methods: {
        init () {
            // 讓chrome pixi devTool出現
            if (process.env.NODE_ENV === 'development') {
                window.PIXI = PIXI
            }

            this.app = new PIXI.Application({
                width: 800,
                height: 600
                // transparent: true // 背景透明
            })

            // 展開全螢幕
            this.app.renderer.view.style.position = 'absolute'
            this.app.renderer.view.style.display = 'block'
            this.app.renderer.autoResize = true
            this.app.renderer.resize(window.innerWidth, window.innerHeight)

            this.$refs.sample2.appendChild(this.app.view)

            // this.app.loader.add('bunny', logo)

            let triangle = new PIXI.Graphics();

            triangle.beginTextureFill({ texture: this.gradientBg({
                colorArr: ['#fff','#CB2929','#800505', '#000'],
                // stepArr: [0, 0.2, 0.8, 1],
                width: 100,
                height: 300
            })})

            // triangle.beginFill(0x006DDD)
            triangle.moveTo(0,0)
            triangle.lineTo(0, 300);
            triangle.lineTo(150, 300);
            triangle.lineTo(0, 0);
            triangle.endFill();
            this.app.stage.addChild(triangle)


            // 單向漸層
            const sprite1 = new PIXI.Sprite(this.gradientBg({
                colorArr: ['#fff','#CB2929','#800505', '#000'],
                // stepArr: [0, 0.2, 0.8, 1],
                width: 34,
                height: 67
            }))
            sprite1.x = 200
            sprite1.y = 200
            this.app.stage.addChild(sprite1)


            // 輻射漸層
            const sprite2 = new PIXI.Sprite(this.radialBg({
                colorArr: ['#fff','#CB2929','#800505', '#000'],
                // stepArr: [0, 0.2, 0.8, 1],
                width: 200,
                height: 200
            }))
            sprite2.x = 400
            sprite2.y = 200
            this.app.stage.addChild(sprite2)
        },
        /**
         * 繪製單向漸層
         * @param {Array} param.colorArr required, 漸層顏色
         * @param {Array} param.stepArr optional, 漸層自定義step, 未提供使用平均區間
         * @param {Number} param.width required, 寬度
         * @param {Number} param.height required, 高度
         * @returns PIXI.Texture
         */
        gradientBg({colorArr, stepArr = [], width, height}){
            const canvas = document.createElement("canvas");
            canvas.setAttribute("width", width);
            canvas.setAttribute("height", height);

            const ctx = canvas.getContext("2d");
            const grd = ctx.createLinearGradient(0, 0, 0, height);

            colorArr.forEach((rawColor, idx) => {
                const step = stepArr[idx] || (1 / (colorArr.length -1) ) * idx
                grd.addColorStop(step, rawColor); 
            })

            ctx.fillStyle = grd;
            ctx.fillRect(0, 0, width, height);
            return new PIXI.Texture.from(canvas);
        },
        // 繪製輻射漸層
        radialBg({colorArr, stepArr = [], width, height}) {
            const canvas = document.createElement("canvas");
            canvas.setAttribute("width", width);
            canvas.setAttribute("height", height);

            const ctx = canvas.getContext("2d");
            const half = 0.5 * height
            const grd = ctx.createRadialGradient(half, half, half, half, half, 0);

            colorArr.forEach((rawColor, idx) => {
                const step = stepArr[idx] || (1 / (colorArr.length -1) ) * idx
                grd.addColorStop(step, rawColor); 
            })

            ctx.fillStyle = grd;
            ctx.fillRect(0, 0, width, height);
            return new PIXI.Texture.from(canvas);
        }
    }
}
</script>

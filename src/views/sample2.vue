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

            // 三角形
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
            const radialBg = this.radialBg({
                colorArr: ['#95761C','#E0D497','#E6DFB2', '#FFFFF0'],
                stepArr: [0, 0.34, 0.58, 1],
                width: 590,
                height: 290
            })

            // 參考圖
            const sprite2 = new PIXI.Sprite(radialBg)
            sprite2.x = 400 +5
            sprite2.y = 400 +5

            // 加入圓角矩形
            const [beginX, beginY, borderLength, radius] = [400,400, 2, 10]
            let roundedRect = new PIXI.Graphics();
            roundedRect.addChild(sprite2)
            roundedRect.lineStyle(borderLength, 0xFFFFFF, 1);
            roundedRect.drawRoundedRect(beginX, beginY, 600, 300, radius);
            roundedRect.lineStyle(2*borderLength, 0x95761C, 1);
            const delta = 3*borderLength/2
            roundedRect.drawRoundedRect(beginX + delta, beginY + delta, 600 - 2 * delta, 300 - 2 * delta, radius / 2);
            roundedRect.endFill();
            this.app.stage.addChild(roundedRect)
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
        /**
         * 繪製輻射漸層
         * @param {Array} param.colorArr required, 漸層顏色
         * @param {Array} param.stepArr optional, 漸層自定義step, 未提供使用平均區間
         * @param {Number} param.width required, 寬度
         * @param {Number} param.height required, 高度
         * @returns PIXI.Texture
         */
        radialBg({colorArr, stepArr = [], width, height}) {
            const canvas = document.createElement("canvas");
            const maxRadius = Math.max(width, height)
            canvas.setAttribute("width", maxRadius);
            canvas.setAttribute("height", maxRadius);

            const ctx = canvas.getContext("2d");
            const maxhalf = 0.5 * maxRadius
            const grd = ctx.createRadialGradient(maxhalf, maxhalf, maxhalf, maxhalf, maxhalf, 0);

            colorArr.forEach((rawColor, idx) => {
                const step = stepArr[idx] || (1 / (colorArr.length -1) ) * idx
                grd.addColorStop(step, rawColor); 
            })

            let [scaleX, scaleY] = [1,1]
            if(width >= height) {
                scaleY = height / width
            } else {
                scaleX = width / height
            }

            ctx.fillStyle = grd;
            ctx.setTransform(scaleX,0,0,scaleY,0,0);
            ctx.fillRect(0, 0, Math.max(width, height), Math.max(width, height));
            return new PIXI.Texture.from(canvas)
        },
        }
    }
}
</script>

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
            

            // 圓角矩形輻射
            const sp = this.drawRadiaRoundRect({
                colorArr: ['#95761C','#E0D497','#E6DFB2', '#FFFFF0'],
                // stepArr,
                width: 60*12,
                height: 26*12,
                radius: 20,
                borderLength: 2,
                beginX: 400,
                beginY: 20
            })
            this.app.stage.addChild(sp)

            // 圓角矩形輻射-遮罩
            const sp2 = this.drawRadiaRoundRect2({
                colorArr: ['#95761C','#E0D497','#E6DFB2', '#FFFFF0'],
                // stepArr,
                width: 60*12,
                height: 26*12,
                radius: 20,
                borderLength: 2,
                beginX: 400,
                beginY: 500
            })
            this.app.stage.addChild(sp2)
        },
        /**
         * 繪製單向漸層
         * @param {Array} param.colorArr required, 漸層顏色，由外而內
         * @param {Array} param.stepArr optional, 漸層自定義step，未提供則使用平均區間
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
         * @param {Array} param.colorArr required, 漸層顏色，由外而內
         * @param {Array} param.stepArr optional, 漸層自定義step，未提供則使用平均區間
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
        /**
         * 繪製圓角輻射矩形
         * @param {Array} param.colorArr required, 漸層顏色，由外而內
         * @param {Array} param.stepArr optional, 漸層自定義step，未提供則使用平均區間
         * @param {Number} param.width required, 寬度
         * @param {Number} param.height required, 高度
         * @param {Number} param.radius required, 矩形圓角
         * @param {Number} param.borderLength required, 框線寬度
         * @param {Number} param.beginX required, 起點X座標
         * @param {Number} param.beginY required, 起點Y座標
         */
        drawRadiaRoundRect({colorArr, stepArr, width: w, height: h, radius: r, borderLength = 2, beginX, beginY}) {
            const contaniner = new PIXI.Container();

            // 輻射漸層
            const radialBg = this.radialBg({ 
                colorArr,
                stepArr,
                width: w - r*0.60,
                height: h - r*0.60
            })
            const bg = new PIXI.Sprite(radialBg)
            bg.x = beginX + r*0.32
            bg.y = beginY + r*0.32
            contaniner.addChild(bg)

            // 填充線
            const paddingline = new PIXI.Graphics();
            const delta = 3 * borderLength / 2 // 偏移量
            paddingline.lineStyle(3*borderLength, colorArr[0].replace('#', '0x'), 1);
            paddingline.drawRoundedRect(beginX + delta, beginY + delta, w - 2 * delta, h - 2 * delta, r * 0.7 );
            contaniner.addChild(paddingline)

            // 框線
            const line = new PIXI.Graphics();
            line.lineStyle(borderLength, 0xFFFFFF, 1);
            line.drawRoundedRect(beginX, beginY, w, h, r);
            contaniner.addChild(line)

            return contaniner
        },
        /**
         * 繪製圓角輻射矩形-使用遮罩
         * @param {Array} param.colorArr required, 漸層顏色，由外而內
         * @param {Array} param.stepArr optional, 漸層自定義step，未提供則使用平均區間
         * @param {Number} param.width required, 寬度
         * @param {Number} param.height required, 高度
         * @param {Number} param.radius required, 矩形圓角
         * @param {Number} param.borderLength required, 框線寬度
         * @param {Number} param.beginX required, 起點X座標
         * @param {Number} param.beginY required, 起點Y座標
         */
        drawRadiaRoundRect2({colorArr, stepArr, width: w, height: h, radius: r, borderLength = 2, beginX, beginY}) {
            const contaniner = new PIXI.Container();

            // 輻射漸層
            const radialBg = this.radialBg({ 
                colorArr,
                stepArr,
                width: w,
                height: h
            })
            const bg = new PIXI.Sprite(radialBg)
            bg.x = beginX
            bg.y = beginY
            contaniner.addChild(bg)

            // 框線
            const line = new PIXI.Graphics();
            line.lineStyle(borderLength, 0xFFFFFF, 1, 0);
            line.drawRoundedRect(beginX, beginY, w, h, r);
            contaniner.addChild(line)

            // 遮罩
            const mask = new PIXI.Graphics();
            mask.beginFill(4, 0xFFFFFF)
            mask.drawRoundedRect(beginX, beginY, w, h, r);
            mask.endFill();
            bg.mask = mask
            contaniner.addChild(mask)
            
            return contaniner
        }
    }
}
</script>

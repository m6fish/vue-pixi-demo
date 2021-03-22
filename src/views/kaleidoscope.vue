<template>
  <div>
      <div ref="painting" />
  </div>
</template>

<script>
import * as PIXI from 'pixi.js'
import bunny from '@/assets/bunny.png'

export default {
    name: 'painting',
    data () {
        return {
            app: null,
            loader: null,
            bunnyArr: [],
            degree: 0,
            mainContainer: null
        }
    },
    mounted () {
        // 讓chrome pixi devTool出現
        if (process.env.NODE_ENV === 'development') {
            window.PIXI = PIXI
        }

        // 設定簡寫
        this.app = new PIXI.Application({
            width: 800,
            height: 600
            // transparent: true // 背景透明
        })
        this.loader = this.app.loader

        // 展開全螢幕
        this.app.renderer.view.style.position = 'absolute'
        this.app.renderer.view.style.display = 'block'
        this.app.renderer.autoResize = true
        this.app.renderer.resize(window.innerWidth, window.innerHeight)

        this.$refs.painting.appendChild(this.app.view)

        this.loader
            .add('bunny', bunny)
            .load((loader, resources) => {
                this.init()
            })
            // .load(this.init()) // Q: 這樣圖片會出不來
    },
    methods: {
        init () {
            this.app.stage.addChild(this.drawMain())
            this.app.ticker.add(this.gameLoop)
        },
        drawMain () {
            const container = new PIXI.Container()
            container.x = 500
            container.y = 500

            for (let i = 0; i < 6; i++) {
                const cardContainer = new PIXI.Container()

                // 三角形 (x, y) = (r\*cosθ, r\*sinθ)
                const r = 100
                const triangle = new PIXI.Graphics()
                const angle = Math.PI / 3 // 60度
                triangle.beginFill(0x006DDD)
                triangle.moveTo(0, 0)
                triangle.lineTo(r, 0)
                triangle.lineTo(r * Math.cos(angle), -r * Math.sin(angle))
                triangle.lineTo(0, 0)
                triangle.endFill()
                cardContainer.addChild(triangle)

                // 兔子
                const bunnyPic = new PIXI.Sprite(this.loader.resources.bunny.texture)
                bunnyPic.x = 0.5 * (r - bunnyPic.width)
                bunnyPic.y = 0
                cardContainer.addChild(bunnyPic)
                this.bunnyArr.push(bunnyPic)

                // 兔子遮罩
                const bunnyMask = triangle.clone()
                bunnyPic.mask = bunnyMask
                cardContainer.addChild(bunnyMask) // Q: 不加進去會看不到兔子

                // 旋轉, 翻轉
                cardContainer.pivot.set(0, 0)
                if (i % 2) {
                    cardContainer.scale.x = -1
                }
                cardContainer.rotation = angle * i
                container.addChild(cardContainer)
            }

            this.mainContainer = container
            return container
        },
        gameLoop (delta) {
            this.degree = this.degree > 359 ? 1 : this.degree + 1

            this.bunnyArr.forEach((oneBunny, idx) => {
                const PADDING = 30
                const arc = (this.degree + (idx * 30)) * (Math.PI / 180) // SHM
                oneBunny.y = oneBunny.height * Math.sin(arc) - PADDING
            })

            this.mainContainer.rotation += 0.005
        }
    }
}
</script>

<template>
  <div>
      <div ref="gsap" />
  </div>
</template>

<script>
import * as PIXI from 'pixi.js'
import { gsap } from 'gsap'

export default {
    name: 'gsap',
    data () {
        return {
            app: null,
            RADIUS: 300,
            LINE_NUM: 3
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

        // 展開全螢幕
        this.app.renderer.view.style.position = 'absolute'
        this.app.renderer.view.style.display = 'block'
        this.app.renderer.autoResize = true
        this.app.renderer.resize(window.innerWidth, window.innerHeight)

        this.$refs.gsap.appendChild(this.app.view)
        this.init()
    },
    methods: {
        init () {
            this.app.stage.addChild(this.drawMain())
            // this.app.ticker.add(this.gameLoop)
        },
        drawMain () {
            const container = new PIXI.Container()
            container.x = 500
            container.y = 300
            const angle = Math.PI / this.LINE_NUM

            for (let i = 0; i < this.LINE_NUM; i++) {
                const oneLine = new PIXI.Container()

                // 線段
                const line = new PIXI.Graphics()
                line.lineStyle(1, 0xCCCCCC, 1)
                line.moveTo(-1 * this.RADIUS, 0)
                line.lineTo(this.RADIUS, 0)
                oneLine.addChild(line)

                // 球
                const ball = new PIXI.Graphics()
                ball.beginFill(0xCCCCCC)
                ball.drawCircle(0, 0, 6)
                oneLine.addChild(ball)

                gsap.to(line, { duration: 2, pixi: { lineColor: 'purple' } })

                // 球擺動
                const tl = gsap.timeline({ repeat: 2 })
                tl.to(ball, {
                    ease: 'power2.out',
                    pixi: {
                        x: 300,
                        scaleX: 3,
                        scaleY: 3
                    },
                    duration: 1
                }).to(ball, {
                    ease: 'power2.in',
                    pixi: {
                        scaleX: 1,
                        scaleY: 1,
                        x: 0
                    },
                    duration: 1
                }).to(ball, {
                    ease: 'power2.out',
                    pixi: {
                        x: -300,
                        scaleX: 3,
                        scaleY: 3
                    },
                    duration: 1
                }).to(ball, {
                    ease: 'power2.in',
                    pixi: {
                        x: 0,
                        scaleX: 1,
                        scaleY: 1
                    },
                    duration: 1
                })

                // 旋轉
                oneLine.rotation = angle * i

                container.addChild(oneLine)
            }

            return container
        }
    }
}
</script>

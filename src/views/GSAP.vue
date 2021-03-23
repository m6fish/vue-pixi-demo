<template>
  <div>
      <div ref="gsap" />
  </div>
</template>

<script>
import * as PIXI from 'pixi.js'
import { gsap } from 'gsap'
import { radialBg } from '@/utils'

export default {
    name: 'gsap',
    data () {
        return {
            app: null,
            RADIUS: 100,
            LINE_NUM: 3,
            lightOn: false // 燈開關
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
            this.app.stage.addChild(this.drawShine())
        },
        drawMain () {
            const container = new PIXI.Container()
            container.x = 200
            container.y = 200
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
                const tl = gsap.timeline({ repeat: -1 })
                tl.to(ball, {
                    ease: 'power2.out',
                    pixi: {
                        x: this.RADIUS,
                        scaleX: 2,
                        scaleY: 2
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
                        x: -1 * this.RADIUS,
                        scaleX: 2,
                        scaleY: 2
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
        },
        drawShine () {
            const container = new PIXI.Container()
            container.x = 600
            container.y = 300
            container.pivot.x = this.RADIUS
            container.pivot.y = this.RADIUS

            container.interactive = true // 設定可以互動
            container.buttonMode = true // 當滑鼠滑過時顯示為手指圖示

            // cycle
            const cycle = new PIXI.Graphics()
            cycle.beginFill(0xCCCCCC)
            cycle.drawCircle(this.RADIUS, this.RADIUS, this.RADIUS)
            cycle.endFill()
            container.addChild(cycle)

            // BG
            const bgOn = new PIXI.Sprite(radialBg({
                colorArr: ['#95761C', '#E0D497', '#E6DFB2', '#FFFFF0'],
                width: this.RADIUS * 2,
                height: this.RADIUS * 2
            }))
            bgOn.visible = false
            container.addChild(bgOn)

            const bgOff = new PIXI.Sprite(radialBg({
                colorArr: ['#111', '#555', '#AAA', '#CCC'],
                width: this.RADIUS * 2,
                height: this.RADIUS * 2
            }))
            container.addChild(bgOff)

            // cycle mask
            const mask = cycle.clone()
            bgOn.mask = mask
            bgOff.mask = mask
            container.addChild(mask)

            // 事件
            container.on('pointerover', () => {
                gsap.to(container, {
                    pixi: {
                        scaleX: 1.1,
                        scaleY: 1.1
                    },
                    duration: 0.2
                })
            })
            container.on('pointerout', () => {
                gsap.to(container, {
                    pixi: {
                        scaleX: 1,
                        scaleY: 1
                    },
                    duration: 0.2
                })
            })
            container.on('pointerdown', () => {
                console.log('click on')
                this.lightOn = !this.lightOn

                bgOn.visible = this.lightOn
                bgOff.visible = !this.lightOn
            })

            container.on('pointerup', () => {
                console.log('click off')
            })

            // 動態效果
            // const tl = gsap.timeline({ repeat: -1, yoyo: true, ease: 'power2.out' })
            // tl.to(container, {
            //     pixi: {
            //         scaleX: 1.2,
            //         scaleY: 1.2
            //     },
            //     duration: 1
            // })

            return container
        }
    }
}
</script>

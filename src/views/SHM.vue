<template>
  <div>
      <div ref="shm" />
  </div>
</template>

<script>
import * as PIXI from 'pixi.js'

export default {
    name: 'shm',
    data () {
        return {
            app: null,
            balls: [],
            ballDegree: 0,
            LINE_NUM: 6, // 線段數
            RADIUS: 200 // 圓半徑
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

        this.$refs.shm.appendChild(this.app.view)
        this.init()
    },
    methods: {
        init () {
            this.app.stage.addChild(this.drawMain())

            this.app.ticker.add(this.gameLoop)
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

                // 旋轉
                oneLine.rotation = angle * i

                this.balls.push(ball)
                container.addChild(oneLine)
            }

            return container
        },
        gameLoop (delta) {
            this.ballDegree = this.ballDegree > 359 ? 1 : this.ballDegree + 1
            const delayAngle = 180 / this.LINE_NUM

            this.balls.forEach((oneBall, idx) => {
                const arc = (this.ballDegree + (idx * delayAngle)) * (Math.PI / 180)
                oneBall.x = Math.sin(arc) * this.RADIUS // 1,0,-1,0
            })
        }
    }
}
</script>

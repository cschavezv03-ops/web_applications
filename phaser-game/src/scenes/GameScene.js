import Phaser from 'phaser';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    preload() {
        this.load.on('loaderror', (archivo) => {
            console.error('No se pudo cargar:', archivo.src);
        });
        this.load.image('fondo', '/assets/fondo.jpg');
        for (let i = 0; i < 7; i++) {
            this.load.image(`cara${i}`, `/assets/cara${i}.png`);
        }
    }

    create() {
        this.puntos = 0;
        this.tiempo = 30;
        this.aciertos = 0;
        this.errores = 0;
        this.finalizado = false;
        this.bloqueado = true;
        this.record = this.cargarRecord();
        this.cronometro = null;

        this.add.image(400, 300, 'fondo').setDisplaySize(800, 600);
        this.add.rectangle(400, 300, 800, 600, 0x0b1020, 0.76);
        this.add.text(400, 38, 'ACIERTA LA IMAGEN', {
            fontFamily: 'Arial', fontSize: '34px', color: '#ffffff'
        }).setOrigin(0.5);

        this.textoPuntos = this.add.text(30, 90, 'Puntos: 0', {
            fontFamily: 'Arial', fontSize: '22px', color: '#ffffff'
        });
        this.textoTiempo = this.add.text(770, 90, 'Tiempo: 30', {
            fontFamily: 'Arial', fontSize: '22px', color: '#ffffff'
        }).setOrigin(1, 0);
        this.textoRecord = this.add.text(400, 90, `Récord: ${this.record}`, {
            fontFamily: 'Arial', fontSize: '20px', color: '#ffffff'
        }).setOrigin(0.5, 0);
        this.textoMensaje = this.add.text(400, 555, '', {
            fontFamily: 'Arial', fontSize: '22px', color: '#ffffff'
        }).setOrigin(0.5);

        this.imagenObjetivo = this.add.image(400, 250, 'cara0');
        const posiciones = [116, 305, 495, 684];
        this.opciones = [];
        posiciones.forEach((x, indice) => {
            const imagen = this.add.image(x, 445, 'cara0');
            imagen.setInteractive({ useHandCursor: true });
            imagen.on('pointerdown', () => this.evaluarRespuesta(indice));
            this.opciones.push(imagen);
        });

        this.mostrarPantallaInicio();
    }

    cargarRecord() {
        try {
            const record = Number(window.localStorage.getItem('aciertaImagenRecord'));
            return Number.isFinite(record) && record > 0 ? record : 0;
        } catch (error) {
            console.warn('No se pudo leer el récord guardado:', error);
            return 0;
        }
    }

    guardarRecord() {
        try {
            window.localStorage.setItem('aciertaImagenRecord', String(this.record));
        } catch (error) {
            console.warn('No se pudo guardar el récord:', error);
        }
    }

    mostrarPantallaInicio() {
        this.pantallaInicio = this.add.container(0, 0);
        const fondo = this.add.rectangle(400, 300, 800, 600, 0x020617, 0.92)
            .setInteractive();
        const titulo = this.add.text(400, 165, '¡Acierta la imagen!', {
            fontFamily: 'Arial', fontSize: '38px', color: '#ffffff'
        }).setOrigin(0.5);
        const instrucciones = this.add.text(
            400,
            270,
            'Observa la imagen objetivo y elige la misma entre las cuatro opciones.\n' +
                'Cada acierto suma 10 puntos. Tienes 30 segundos.\n' +
                `Tu récord actual es: ${this.record}`,
            {
                fontFamily: 'Arial',
                fontSize: '21px',
                color: '#e2e8f0',
                align: 'center',
                lineSpacing: 12,
                wordWrap: { width: 650 }
            }
        ).setOrigin(0.5);
        const boton = this.add.rectangle(400, 420, 245, 62, 0x0284c7)
            .setInteractive({ useHandCursor: true });
        const textoBoton = this.add.text(400, 420, 'COMENZAR', {
            fontFamily: 'Arial', fontSize: '22px', color: '#ffffff'
        }).setOrigin(0.5);

        this.pantallaInicio.add([fondo, titulo, instrucciones, boton, textoBoton]);
        boton.on('pointerdown', () => {
            this.pantallaInicio.destroy(true);
            this.pantallaInicio = null;
            this.iniciarJuego();
        });
    }

    iniciarJuego() {
        this.bloqueado = false;
        this.nuevaRonda();
        this.cronometro = this.time.addEvent({
            delay: 1000,
            loop: true,
            callback: () => {
                if (this.finalizado) return;
                this.tiempo -= 1;
                this.textoTiempo.setText(`Tiempo: ${this.tiempo}`);
                if (this.tiempo <= 0) this.terminarJuego();
            }
        });
    }

    escalarDentro(imagen, maxAncho, maxAlto) {
        const escala = Math.min(maxAncho / imagen.width,
            maxAlto / imagen.height);
        imagen.setScale(escala);
    }

    nuevaRonda() {
        if (this.finalizado) return;

        const disponibles = Array.from({ length: 7 }, (_, i) => `cara${i}`);
        const seleccionadas = Phaser.Utils.Array.Shuffle(disponibles).slice(0, 4);
        this.solucion = Phaser.Math.Between(0, 3);
        this.imagenObjetivo.setTexture(seleccionadas[this.solucion]);
        this.escalarDentro(this.imagenObjetivo, 220, 220);
        this.opciones.forEach((imagen, i) => {
            imagen.setTexture(seleccionadas[i]);
            this.escalarDentro(imagen, 125, 125);
        });
        this.bloqueado = false;
        this.textoMensaje.setText('');
    }

    evaluarRespuesta(indice) {
        if (this.finalizado || this.bloqueado) return;
        this.bloqueado = true;

        if (indice === this.solucion) {
            this.puntos += 10;
            this.aciertos += 1;
            this.textoPuntos.setText(`Puntos: ${this.puntos}`);
            this.textoMensaje.setText('¡Correcto! +10 puntos');
            if (this.puntos > this.record) {
                this.record = this.puntos;
                this.textoRecord.setText(`Récord: ${this.record}`);
                this.guardarRecord();
            }
        } else {
            this.errores += 1;
            this.textoMensaje.setText('Respuesta incorrecta');
        }

        this.time.delayedCall(700, () => {
            if (!this.finalizado) this.nuevaRonda();
        });
    }

    terminarJuego() {
        if (this.finalizado) return;
        this.finalizado = true;
        this.bloqueado = true;
        if (this.cronometro) this.cronometro.remove();
        this.add.rectangle(400, 300, 800, 600, 0x020617, 0.88);
        this.add.text(400, 220, 'TIEMPO TERMINADO', {
            fontSize: '42px', color: '#ffffff'
        }).setOrigin(0.5);
        this.add.text(400, 300, `Puntos: ${this.puntos}`, {
            fontSize: '26px', color: '#ffffff'
        }).setOrigin(0.5);
        this.add.text(400, 345, `Récord: ${this.record}`, {
            fontSize: '22px', color: '#ffffff'
        }).setOrigin(0.5);
        const boton = this.add.rectangle(400, 410, 245, 62, 0x0284c7)
        .setInteractive({ useHandCursor: true });
        this.add.text(400, 410, 'VOLVER A JUGAR', {
            fontSize: '22px', color: '#ffffff'
        }).setOrigin(0.5);
        boton.on('pointerdown', () => this.scene.restart());
    }
}

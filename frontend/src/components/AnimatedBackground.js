import React, { useEffect, useRef } from 'react';
import './CosmicBackground.css';

const AnimatedBackground = ({ variant = 'neural' }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Optimized context for better performance
        const ctx = canvas.getContext('2d', {
            alpha: true,
            desynchronized: true,
            powerPreference: 'high-performance'
        });

        let particles = [];
        let animationId;





        // Resize canvas to full screen
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Neural Network Node class
        class NeuralNode {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 4 + 2;
                this.speedX = (Math.random() - 0.5) * 0.5;
                this.speedY = (Math.random() - 0.5) * 0.5;
                this.connections = [];
                this.activity = Math.random();
                this.pulse = 0;
                
                // Add digital elements
                this.hasDigitalRing = Math.random() > 0.7;
                this.digitalValue = Math.floor(Math.random() * 100);
                this.ringRotation = 0;
                this.dataStream = [];
                
                // Initialize data stream
                for (let i = 0; i < 8; i++) {
                    this.dataStream.push({
                        angle: (i / 8) * Math.PI * 2,
                        distance: 0,
                        opacity: 1,
                        char: Math.random() > 0.5 ? '1' : '0'
                    });
                }
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                // Bounce off edges
                if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
                if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;

                // Update activity and pulse - smoother animation
                this.activity += (Math.random() - 0.5) * 0.02;
                this.activity = Math.max(0.3, Math.min(0.8, this.activity));
                this.pulse += 0.00625; // Slowed down 8x (was 0.05)
                
                // Update digital elements
                this.ringRotation += 0.00125; // Slowed down 8x (was 0.01)
                
                // Update data stream
                this.dataStream.forEach(stream => {
                    stream.distance += 0.0625; // Slowed down 8x (was 0.5)
                    stream.opacity = Math.max(0, 1 - stream.distance / 50);
                    
                    if (stream.distance > 50) {
                        stream.distance = 0;
                        stream.opacity = 1;
                        stream.char = Math.random() > 0.5 ? '1' : '0';
                    }
                });
                
                // Randomly change digital value
                if (Math.random() < 0.01) {
                    this.digitalValue = Math.floor(Math.random() * 100);
                }
            }

            draw() {
                ctx.save();

                // Draw node with more visible pulsing effect
                const pulseSize = this.size + Math.sin(this.pulse) * 1.2;
                const alpha = 0.6 + this.activity * 0.4;

                // Outer glow
                const outerGlow = ctx.createRadialGradient(
                    this.x, this.y, 0,
                    this.x, this.y, pulseSize * 4
                );
                outerGlow.addColorStop(0, `hsla(${280 + this.activity * 30}, 80%, 70%, ${alpha * 0.4})`);
                outerGlow.addColorStop(0.3, `hsla(${240 + this.activity * 40}, 70%, 60%, ${alpha * 0.25})`);
                outerGlow.addColorStop(1, `hsla(${200 + this.activity * 50}, 60%, 50%, 0)`);

                ctx.fillStyle = outerGlow;
                ctx.beginPath();
                ctx.arc(this.x, this.y, pulseSize * 4, 0, Math.PI * 2);
                ctx.fill();

                // Main node with gradient
                const gradient = ctx.createRadialGradient(
                    this.x, this.y, 0,
                    this.x, this.y, pulseSize * 2
                );
                gradient.addColorStop(0, `hsla(${280 + this.activity * 60}, 90%, 85%, ${alpha})`);
                gradient.addColorStop(0.4, `hsla(${240 + this.activity * 80}, 80%, 75%, ${alpha * 0.8})`);
                gradient.addColorStop(0.8, `hsla(${200 + this.activity * 100}, 70%, 65%, ${alpha * 0.4})`);
                gradient.addColorStop(1, `hsla(${160 + this.activity * 120}, 60%, 55%, 0)`);

                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(this.x, this.y, pulseSize * 2, 0, Math.PI * 2);
                ctx.fill();

                // Inner bright core
                ctx.globalAlpha = alpha;
                ctx.fillStyle = `hsl(${300 + this.activity * 60}, 95%, 90%)`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, pulseSize * 0.6, 0, Math.PI * 2);
                ctx.fill();

                // Ultra bright center
                ctx.globalAlpha = alpha * 1.2;
                ctx.fillStyle = `hsl(${320 + this.activity * 40}, 100%, 95%)`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, pulseSize * 0.2, 0, Math.PI * 2);
                ctx.fill();

                // Add digital elements
                if (this.hasDigitalRing) {
                    // Digital ring
                    ctx.save();
                    ctx.translate(this.x, this.y);
                    ctx.rotate(this.ringRotation);
                    
                    const ringRadius = pulseSize * 6;
                    ctx.strokeStyle = `hsla(${280 + this.activity * 60}, 90%, 80%, ${alpha * 0.6})`;
                    ctx.lineWidth = 1.5;
                    ctx.setLineDash([3, 3]);
                    
                    ctx.beginPath();
                    ctx.arc(0, 0, ringRadius, 0, Math.PI * 2);
                    ctx.stroke();
                    
                    // Outer ring for better visibility
                    ctx.strokeStyle = `hsla(${260 + this.activity * 40}, 85%, 75%, ${alpha * 0.3})`;
                    ctx.lineWidth = 0.8;
                    ctx.setLineDash([2, 4]);
                    ctx.beginPath();
                    ctx.arc(0, 0, ringRadius + 8, 0, Math.PI * 2);
                    ctx.stroke();
                    
                    // Digital value in center
                    ctx.setLineDash([]);
                    ctx.fillStyle = `hsla(${300 + this.activity * 40}, 95%, 85%, ${alpha})`;
                    ctx.font = 'bold 11px monospace';
                    ctx.textAlign = 'center';
                    ctx.fillText(this.digitalValue.toString(), 0, 4);
                    
                    ctx.restore();
                }
                
                // Data stream around node - more visible
                this.dataStream.forEach(stream => {
                    if (stream.opacity > 0.1) {
                        const x = this.x + Math.cos(stream.angle) * stream.distance;
                        const y = this.y + Math.sin(stream.angle) * stream.distance;
                        
                        ctx.save();
                        ctx.globalAlpha = stream.opacity * alpha * 1.2;
                        
                        // Glow behind digit
                        ctx.fillStyle = `hsl(${200 + this.activity * 80}, 90%, 80%)`;
                        ctx.shadowColor = `hsl(${200 + this.activity * 80}, 90%, 80%)`;
                        ctx.shadowBlur = 3;
                        ctx.font = 'bold 9px monospace';
                        ctx.textAlign = 'center';
                        ctx.fillText(stream.char, x, y);
                        
                        ctx.shadowBlur = 0;
                        ctx.restore();
                    }
                });
                
                // Additional visual effects for active nodes
                if (this.activity > 0.7) {
                    ctx.save();
                    ctx.strokeStyle = `hsla(${320 + this.activity * 40}, 95%, 85%, ${alpha * 0.6})`;
                    ctx.lineWidth = 2;
                    ctx.setLineDash([1, 2]);
                    
                    // Pulsating outer contour
                    const activeRadius = pulseSize * 8 + Math.sin(this.pulse * 2) * 3;
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, activeRadius, 0, Math.PI * 2);
                    ctx.stroke();
                    
                    ctx.restore();
                }

                ctx.restore();
            }

            drawConnections(nodes) {
                ctx.save();

                nodes.forEach(node => {
                    if (node === this) return;

                    const dx = node.x - this.x;
                    const dy = node.y - this.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 200) {
                        const opacity = (200 - distance) / 200 * 0.7;
                        const activity = (this.activity + node.activity) / 2;

                        // Thin straight line with gradient
                        const gradient = ctx.createLinearGradient(this.x, this.y, node.x, node.y);
                        gradient.addColorStop(0, `hsla(${280 + this.activity * 60}, 85%, 75%, ${opacity * this.activity})`);
                        gradient.addColorStop(0.5, `hsla(${240 + activity * 80}, 80%, 70%, ${opacity * activity * 1.2})`);
                        gradient.addColorStop(1, `hsla(${200 + node.activity * 100}, 75%, 65%, ${opacity * node.activity})`);

                        ctx.strokeStyle = gradient;
                        ctx.lineWidth = 0.8 + activity * 0.4;
                        ctx.lineCap = 'round';

                        ctx.beginPath();
                        ctx.moveTo(this.x, this.y);
                        ctx.lineTo(node.x, node.y);
                        ctx.stroke();

                        // Thin signal pulses
                        if (Math.random() < 0.015) {
                            const progress = Math.random();
                            const signalX = this.x + dx * progress;
                            const signalY = this.y + dy * progress;

                            // Small bright pulse
                            ctx.globalAlpha = 0.8;
                            const signalGradient = ctx.createRadialGradient(
                                signalX, signalY, 0,
                                signalX, signalY, 3
                            );
                            signalGradient.addColorStop(0, '#ffffff');
                            signalGradient.addColorStop(0.4, '#a78bfa');
                            signalGradient.addColorStop(1, 'rgba(167, 139, 250, 0)');

                            ctx.fillStyle = signalGradient;
                            ctx.beginPath();
                            ctx.arc(signalX, signalY, 3, 0, Math.PI * 2);
                            ctx.fill();
                        }
                    }
                });

                ctx.restore();
            }
        }

        // Matrix Rain Character class
        class MatrixChar {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.speed = Math.random() * 3 + 1;
                this.char = this.getRandomChar();
                this.opacity = Math.random();
                this.changeTime = 0;
            }

            getRandomChar() {
                const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
                return chars[Math.floor(Math.random() * chars.length)];
            }

            update() {
                this.y += this.speed;
                this.changeTime++;

                if (this.changeTime > 10) {
                    this.char = this.getRandomChar();
                    this.changeTime = 0;
                }

                if (this.y > canvas.height) {
                    this.y = -20;
                    this.x = Math.random() * canvas.width;
                }
            }

            draw() {
                ctx.save();
                ctx.globalAlpha = this.opacity;
                ctx.fillStyle = '#00ff41';
                ctx.font = '14px monospace';
                ctx.fillText(this.char, this.x, this.y);
                ctx.restore();
            }
        }

        // AI Particle class
        class AIParticle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 4 + 2; // Slightly larger size
                this.speedX = (Math.random() - 0.5) * 1.2; // Slower movement
                this.speedY = (Math.random() - 0.5) * 1.2;
                this.hue = Math.random() * 80 + 180; // Extended blue-purple range
                this.life = 1;
                this.decay = Math.random() * 0.015 + 0.003; // Live longer
                this.pulse = 0;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                this.life -= this.decay;
                this.pulse += 0.08; // Slow pulsation

                // Bounce off edges
                if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
                if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;

                if (this.life <= 0) {
                    this.x = Math.random() * canvas.width;
                    this.y = Math.random() * canvas.height;
                    this.life = 1;
                }
            }

            draw() {
                ctx.save();

                const pulseSize = this.size + Math.sin(this.pulse) * 1.5;
                const alpha = this.life * 0.9;

                // Outer glow
                const outerGlow = ctx.createRadialGradient(
                    this.x, this.y, 0,
                    this.x, this.y, pulseSize * 5
                );
                outerGlow.addColorStop(0, `hsla(${this.hue}, 90%, 80%, ${alpha * 0.4})`);
                outerGlow.addColorStop(0.5, `hsla(${this.hue + 20}, 85%, 75%, ${alpha * 0.2})`);
                outerGlow.addColorStop(1, `hsla(${this.hue + 40}, 80%, 70%, 0)`);

                ctx.fillStyle = outerGlow;
                ctx.beginPath();
                ctx.arc(this.x, this.y, pulseSize * 5, 0, Math.PI * 2);
                ctx.fill();

                // Main particle
                const gradient = ctx.createRadialGradient(
                    this.x, this.y, 0,
                    this.x, this.y, pulseSize * 2
                );
                gradient.addColorStop(0, `hsla(${this.hue}, 100%, 85%, ${alpha})`);
                gradient.addColorStop(0.6, `hsla(${this.hue + 15}, 95%, 75%, ${alpha * 0.7})`);
                gradient.addColorStop(1, `hsla(${this.hue + 30}, 90%, 65%, 0)`);

                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(this.x, this.y, pulseSize * 2, 0, Math.PI * 2);
                ctx.fill();

                // Bright core
                ctx.globalAlpha = alpha * 1.2;
                ctx.fillStyle = `hsl(${this.hue + 10}, 100%, 90%)`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, pulseSize * 0.5, 0, Math.PI * 2);
                ctx.fill();

                ctx.restore();
            }
        }

        // Floating orb class
        class FloatingOrb {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 60 + 20;
                this.speedX = (Math.random() - 0.5) * 0.5;
                this.speedY = (Math.random() - 0.5) * 0.5;
                this.hue = Math.random() * 360;
                this.opacity = Math.random() * 0.3 + 0.1;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
                if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;

                this.hue += 0.5;
            }

            draw() {
                ctx.save();
                ctx.globalAlpha = this.opacity;

                const gradient = ctx.createRadialGradient(
                    this.x, this.y, 0,
                    this.x, this.y, this.size
                );
                gradient.addColorStop(0, `hsla(${this.hue}, 70%, 60%, 0.8)`);
                gradient.addColorStop(1, `hsla(${this.hue}, 70%, 60%, 0)`);

                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();

                ctx.restore();
            }
        }

        // Floating Light Orb class - for light friendly animations
        class FloatingLightOrb {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 25 + 15;
                this.speedX = (Math.random() - 0.5) * 0.3;
                this.speedY = (Math.random() - 0.5) * 0.3;
                this.time = Math.random() * Math.PI * 2;
                this.floatSpeed = Math.random() * 0.02 + 0.01;
                this.opacity = Math.random() * 0.4 + 0.3;

                // Warm, friendly colors
                const colors = [
                    { h: 45, s: 100, l: 70 },   // Warm orange
                    { h: 350, s: 80, l: 75 },   // Soft pink
                    { h: 55, s: 95, l: 75 },    // Golden yellow
                    { h: 200, s: 70, l: 80 },   // Light blue
                    { h: 120, s: 60, l: 80 },   // Soft green
                ];
                this.color = colors[Math.floor(Math.random() * colors.length)];
            }

            update() {
                // Smooth floating movement
                this.x += Math.sin(this.time * this.floatSpeed) * 0.5;
                this.y += Math.cos(this.time * this.floatSpeed * 0.7) * 0.3;
                this.time += 0.02;

                // Slow drift
                this.x += this.speedX;
                this.y += this.speedY;

                // Smooth edge reflection
                if (this.x < -this.size) this.x = canvas.width + this.size;
                if (this.x > canvas.width + this.size) this.x = -this.size;
                if (this.y < -this.size) this.y = canvas.height + this.size;
                if (this.y > canvas.height + this.size) this.y = -this.size;
            }

            draw() {
                ctx.save();

                // Pulsating transparency
                const pulseOpacity = this.opacity * (0.7 + Math.sin(this.time * 2) * 0.3);

                // Large soft glow
                const glowSize = this.size * 4;
                const glowGradient = ctx.createRadialGradient(
                    this.x, this.y, 0,
                    this.x, this.y, glowSize
                );

                glowGradient.addColorStop(0, `hsla(${this.color.h}, ${this.color.s}%, ${this.color.l}%, ${pulseOpacity * 0.3})`);
                glowGradient.addColorStop(0.4, `hsla(${this.color.h}, ${this.color.s}%, ${this.color.l}%, ${pulseOpacity * 0.15})`);
                glowGradient.addColorStop(1, `hsla(${this.color.h}, ${this.color.s}%, ${this.color.l}%, 0)`);

                ctx.fillStyle = glowGradient;
                ctx.beginPath();
                ctx.arc(this.x, this.y, glowSize, 0, Math.PI * 2);
                ctx.fill();

                // Main orb with gradient
                const coreGradient = ctx.createRadialGradient(
                    this.x - this.size * 0.3, this.y - this.size * 0.3, 0,
                    this.x, this.y, this.size
                );
                coreGradient.addColorStop(0, `hsla(0, 0%, 100%, ${pulseOpacity * 0.8})`);
                coreGradient.addColorStop(0.3, `hsla(${this.color.h}, ${this.color.s}%, ${Math.min(95, this.color.l + 20)}%, ${pulseOpacity * 0.6})`);
                coreGradient.addColorStop(0.7, `hsla(${this.color.h}, ${this.color.s}%, ${this.color.l}%, ${pulseOpacity * 0.4})`);
                coreGradient.addColorStop(1, `hsla(${this.color.h}, ${this.color.s}%, ${Math.max(50, this.color.l - 20)}%, ${pulseOpacity * 0.2})`);

                ctx.fillStyle = coreGradient;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();

                // Bright core
                const coreSize = this.size * 0.3;
                const coreHighlight = ctx.createRadialGradient(
                    this.x - coreSize * 0.5, this.y - coreSize * 0.5, 0,
                    this.x, this.y, coreSize
                );
                coreHighlight.addColorStop(0, `hsla(0, 0%, 100%, ${pulseOpacity * 0.9})`);
                coreHighlight.addColorStop(0.6, `hsla(${this.color.h}, 80%, 90%, ${pulseOpacity * 0.5})`);
                coreHighlight.addColorStop(1, `hsla(${this.color.h}, 60%, 80%, 0)`);

                ctx.fillStyle = coreHighlight;
                ctx.beginPath();
                ctx.arc(this.x, this.y, coreSize, 0, Math.PI * 2);
                ctx.fill();

                ctx.restore();
            }
        }

        // Neon Cyber Orb class - for bright neon cyberpunk style
        class NeonCyberOrb {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 40 + 20;
                this.speedX = (Math.random() - 0.5) * 1.5;
                this.speedY = (Math.random() - 0.5) * 1.5;
                this.time = Math.random() * Math.PI * 2;
                this.pulseSpeed = Math.random() * 0.05 + 0.03;
                this.opacity = Math.random() * 0.4 + 0.3;
                this.glitchTime = 0;
                this.glitchIntensity = 0;

                // Bright neon cyberpunk colors
                const neonColors = [
                    { h: 300, s: 100, l: 60, name: 'neon-pink' },     // Neon pink
                    { h: 180, s: 100, l: 50, name: 'cyber-cyan' },    // Cyberpunk cyan
                    { h: 60, s: 100, l: 50, name: 'electric-yellow' }, // Electric yellow
                    { h: 120, s: 100, l: 40, name: 'matrix-green' },   // Matrix green
                    { h: 270, s: 100, l: 65, name: 'neon-purple' },   // Neon purple
                    { h: 15, s: 100, l: 55, name: 'cyber-orange' },   // Cyberpunk orange
                ];
                this.color = neonColors[Math.floor(Math.random() * neonColors.length)];

                // Flicker effect
                this.flickerTime = Math.random() * 100;
                this.isFlickering = false;
            }

            update() {
                // Fast movement with inertia
                this.x += this.speedX;
                this.y += this.speedY;
                this.time += this.pulseSpeed;
                this.glitchTime += 0.1;
                this.flickerTime += 0.2;

                // Bounce off edges with effect
                if (this.x < 0 || this.x > canvas.width) {
                    this.speedX *= -0.8;
                    this.glitchIntensity = 1;
                }
                if (this.y < 0 || this.y > canvas.height) {
                    this.speedY *= -0.8;
                    this.glitchIntensity = 1;
                }

                // Glitch fade
                this.glitchIntensity *= 0.95;

                // Random flicker
                this.isFlickering = Math.sin(this.flickerTime) > 0.7 && Math.random() > 0.98;

                // Position limit
                this.x = Math.max(0, Math.min(canvas.width, this.x));
                this.y = Math.max(0, Math.min(canvas.height, this.y));
            }

            draw() {
                ctx.save();

                // Flicker effect
                if (this.isFlickering) {
                    ctx.globalAlpha = Math.random() * 0.5 + 0.5;
                }

                // Pulsating size and brightness (moderate pulsation)
                const pulse = Math.sin(this.time) * 0.2 + 1;
                const glowPulse = Math.sin(this.time * 2) * 0.3 + 1;
                const currentSize = this.size * pulse;
                const currentOpacity = this.opacity * glowPulse;

                // Glitch effect
                const glitchX = this.x + (Math.random() - 0.5) * this.glitchIntensity * 10;
                const glitchY = this.y + (Math.random() - 0.5) * this.glitchIntensity * 10;

                // Outer neon glow (very bright)
                const outerGlow = this.size * 8;
                const outerGradient = ctx.createRadialGradient(
                    glitchX, glitchY, 0,
                    glitchX, glitchY, outerGlow
                );
                outerGradient.addColorStop(0, `hsla(${this.color.h}, 100%, 70%, ${currentOpacity * 0.5})`);
                outerGradient.addColorStop(0.2, `hsla(${this.color.h}, 100%, 60%, ${currentOpacity * 0.25})`);
                outerGradient.addColorStop(0.5, `hsla(${this.color.h}, 90%, 50%, ${currentOpacity * 0.12})`);
                outerGradient.addColorStop(1, `hsla(${this.color.h}, 80%, 40%, 0)`);

                ctx.fillStyle = outerGradient;
                ctx.beginPath();
                ctx.arc(glitchX, glitchY, outerGlow, 0, Math.PI * 2);
                ctx.fill();

                // Medium glow
                const midGlow = currentSize * 3;
                const midGradient = ctx.createRadialGradient(
                    glitchX, glitchY, 0,
                    glitchX, glitchY, midGlow
                );
                midGradient.addColorStop(0, `hsla(${this.color.h}, 100%, 80%, ${currentOpacity * 0.7})`);
                midGradient.addColorStop(0.4, `hsla(${this.color.h}, 100%, 70%, ${currentOpacity * 0.45})`);
                midGradient.addColorStop(0.8, `hsla(${this.color.h}, 90%, 60%, ${currentOpacity * 0.2})`);
                midGradient.addColorStop(1, `hsla(${this.color.h}, 80%, 50%, 0)`);

                ctx.fillStyle = midGradient;
                ctx.beginPath();
                ctx.arc(glitchX, glitchY, midGlow, 0, Math.PI * 2);
                ctx.fill();

                // Main orb with neon effect
                const coreGradient = ctx.createRadialGradient(
                    glitchX - currentSize * 0.3, glitchY - currentSize * 0.3, 0,
                    glitchX, glitchY, currentSize
                );
                coreGradient.addColorStop(0, `hsla(0, 0%, 100%, ${currentOpacity * 0.6})`);
                coreGradient.addColorStop(0.2, `hsla(${this.color.h}, 100%, 90%, ${currentOpacity * 0.5})`);
                coreGradient.addColorStop(0.6, `hsla(${this.color.h}, 100%, 70%, ${currentOpacity * 0.4})`);
                coreGradient.addColorStop(1, `hsla(${this.color.h}, 90%, 50%, ${currentOpacity * 0.2})`);

                ctx.fillStyle = coreGradient;
                ctx.beginPath();
                ctx.arc(glitchX, glitchY, currentSize, 0, Math.PI * 2);
                ctx.fill();

                // Ultra-bright core
                const coreSize = currentSize * 0.4;
                const coreHighlight = ctx.createRadialGradient(
                    glitchX - coreSize * 0.4, glitchY - coreSize * 0.4, 0,
                    glitchX, glitchY, coreSize
                );
                coreHighlight.addColorStop(0, `hsla(0, 0%, 100%, ${currentOpacity * 0.8})`);
                coreHighlight.addColorStop(0.3, `hsla(${this.color.h}, 100%, 95%, ${currentOpacity * 0.6})`);
                coreHighlight.addColorStop(0.7, `hsla(${this.color.h}, 100%, 80%, ${currentOpacity * 0.4})`);
                coreHighlight.addColorStop(1, `hsla(${this.color.h}, 90%, 70%, 0)`);

                ctx.fillStyle = coreHighlight;
                ctx.beginPath();
                ctx.arc(glitchX, glitchY, coreSize, 0, Math.PI * 2);
                ctx.fill();

                // Additional neon rings
                if (Math.random() > 0.95) {
                    ctx.strokeStyle = `hsla(${this.color.h}, 100%, 80%, ${currentOpacity * 0.5})`;
                    ctx.lineWidth = 1.5;
                    ctx.beginPath();
                    ctx.arc(glitchX, glitchY, currentSize * 1.5, 0, Math.PI * 2);
                    ctx.stroke();
                }

                ctx.restore();
            }
        }

        // Cosmic Nebula System - beautiful cosmic nebula
        class NebulaLayer {
            constructor(layerIndex) {
                this.layerIndex = layerIndex;
                this.time = 0;
                this.noiseOffset = Math.random() * 1000;
                
                // Layer parameters
                this.opacity = 0.4 - layerIndex * 0.1;
                this.speed = 0.2 + layerIndex * 0.1;
                this.scale = 1 + layerIndex * 0.3;
                
                // Color schemes for different layers
                this.colorSchemes = [
                    // Layer 0 - bright purple-pink
                    { 
                        primary: { h: 300, s: 90, l: 70 },
                        secondary: { h: 260, s: 85, l: 65 },
                        accent: { h: 340, s: 80, l: 75 }
                    },
                    // Layer 1 - cyan-blue
                    { 
                        primary: { h: 220, s: 80, l: 65 },
                        secondary: { h: 200, s: 75, l: 70 },
                        accent: { h: 180, s: 70, l: 75 }
                    },
                    // Layer 2 - deep purple
                    { 
                        primary: { h: 280, s: 70, l: 50 },
                        secondary: { h: 260, s: 65, l: 55 },
                        accent: { h: 240, s: 60, l: 60 }
                    }
                ];
                
                this.colors = this.colorSchemes[layerIndex % this.colorSchemes.length];
            }

            update() {
                this.time += 0.008;
                this.noiseOffset += 0.003;
            }

            draw() {
                ctx.save();
                
                // Blend mode for beautiful overlay effect
                ctx.globalCompositeOperation = this.layerIndex === 0 ? 'screen' : 'multiply';
                
                // Create several wave-like nebula regions
                this.drawNebulaRegion(canvas.width * 0.3, canvas.height * 0.4, 400, this.colors.primary);
                this.drawNebulaRegion(canvas.width * 0.7, canvas.height * 0.6, 350, this.colors.secondary);
                this.drawNebulaRegion(canvas.width * 0.5, canvas.height * 0.2, 300, this.colors.accent);
                
                // Additional small regions for detail
                if (this.layerIndex === 0) {
                    this.drawNebulaRegion(canvas.width * 0.2, canvas.height * 0.8, 200, this.colors.primary);
                    this.drawNebulaRegion(canvas.width * 0.8, canvas.height * 0.3, 180, this.colors.secondary);
                }
                
                ctx.restore();
            }
            
            drawNebulaRegion(centerX, centerY, baseSize, color) {
                const size = baseSize * this.scale;
                const dynamicOpacity = this.opacity * (0.6 + Math.sin(this.time + this.noiseOffset) * 0.4);
                
                // Create organic shape using multiple overlapping circles
                for (let i = 0; i < 8; i++) {
                    const angle = (i / 8) * Math.PI * 2;
                    const distance = size * 0.3 * (0.5 + Math.sin(this.time * 0.5 + angle) * 0.5);
                    const x = centerX + Math.cos(angle + this.time * 0.2) * distance;
                    const y = centerY + Math.sin(angle + this.time * 0.15) * distance;
                    const regionSize = size * (0.4 + Math.sin(this.time + angle) * 0.2);
                    
                    // Create gradient for each region
                    const gradient = ctx.createRadialGradient(
                        x, y, 0,
                        x, y, regionSize
                    );
                    
                    // Multi-step gradient for realism
                    gradient.addColorStop(0, `hsla(${color.h + Math.sin(this.time + i) * 20}, ${color.s}%, ${color.l + 10}%, ${dynamicOpacity * 0.8})`);
                    gradient.addColorStop(0.2, `hsla(${color.h + 10}, ${color.s - 5}%, ${color.l}%, ${dynamicOpacity * 0.6})`);
                    gradient.addColorStop(0.4, `hsla(${color.h - 10}, ${color.s - 10}%, ${color.l - 5}%, ${dynamicOpacity * 0.4})`);
                    gradient.addColorStop(0.6, `hsla(${color.h - 20}, ${color.s - 15}%, ${color.l - 10}%, ${dynamicOpacity * 0.25})`);
                    gradient.addColorStop(0.8, `hsla(${color.h - 30}, ${color.s - 20}%, ${color.l - 15}%, ${dynamicOpacity * 0.1})`);
                    gradient.addColorStop(1, `hsla(${color.h - 40}, ${color.s - 25}%, ${color.l - 20}%, 0)`);
                    
                    ctx.fillStyle = gradient;
                    ctx.beginPath();
                    ctx.arc(x, y, regionSize, 0, Math.PI * 2);
                    ctx.fill();
                }
                
                // Add bright star-forming regions for foreground layer
                if (this.layerIndex === 0) {
                    const brightSpots = 3;
                    for (let i = 0; i < brightSpots; i++) {
                        const angle = (i / brightSpots) * Math.PI * 2 + this.time * 0.1;
                        const distance = size * 0.2;
                        const x = centerX + Math.cos(angle) * distance;
                        const y = centerY + Math.sin(angle) * distance;
                        const spotSize = size * 0.15;
                        
                        const brightGradient = ctx.createRadialGradient(
                            x, y, 0,
                            x, y, spotSize
                        );
                        
                        brightGradient.addColorStop(0, `hsla(${color.h + 30}, 100%, 85%, ${dynamicOpacity * 0.9})`);
                        brightGradient.addColorStop(0.3, `hsla(${color.h + 20}, 95%, 75%, ${dynamicOpacity * 0.6})`);
                        brightGradient.addColorStop(0.6, `hsla(${color.h + 10}, 90%, 65%, ${dynamicOpacity * 0.3})`);
                        brightGradient.addColorStop(1, `hsla(${color.h}, 85%, 55%, 0)`);
                        
                        ctx.fillStyle = brightGradient;
                        ctx.beginPath();
                        ctx.arc(x, y, spotSize, 0, Math.PI * 2);
                        ctx.fill();
                    }
                }
            }
        }

        // Floating Bubble class - floating bubbles
        class FloatingBubble {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = canvas.height + Math.random() * 200;
                this.size = Math.random() * 60 + 20;
                this.speedY = -(Math.random() * 0.8 + 0.3);
                this.speedX = (Math.random() - 0.5) * 0.4;
                this.time = Math.random() * Math.PI * 2;
                this.floatSpeed = Math.random() * 0.02 + 0.01;
                this.opacity = Math.random() * 0.6 + 0.2;
                this.life = 1;

                // Solar colors for bubbles
                const bubbleColors = [
                    { h: 45, s: 80, l: 75 },    // Warm orange
                    { h: 35, s: 85, l: 70 },    // Red-orange
                    { h: 55, s: 90, l: 80 },    // Yellow-orange
                    { h: 25, s: 75, l: 65 },    // Red
                    { h: 60, s: 95, l: 85 },    // Light yellow
                ];
                this.color = bubbleColors[Math.floor(Math.random() * bubbleColors.length)];
            }

            update() {
                // Floating movement
                this.x += Math.sin(this.time * this.floatSpeed) * 0.8;
                this.y += this.speedY;
                this.x += this.speedX;
                this.time += 0.02;

                // Size reduction as it rises
                this.size *= 0.9995;
                this.life *= 0.998;

                // Bubble respawn
                if (this.y < -this.size || this.life < 0.1) {
                    this.x = Math.random() * canvas.width;
                    this.y = canvas.height + Math.random() * 200;
                    this.size = Math.random() * 60 + 20;
                    this.life = 1;
                    this.speedY = -(Math.random() * 0.8 + 0.3);
                    this.speedX = (Math.random() - 0.5) * 0.4;
                }

                // Wrap horizontally
                if (this.x < -this.size) this.x = canvas.width + this.size;
                if (this.x > canvas.width + this.size) this.x = -this.size;
            }

            draw() {
                ctx.save();

                const dynamicOpacity = this.opacity * this.life * (0.8 + Math.sin(this.time * 3) * 0.2);

                // Outer bubble glow
                const outerGlow = ctx.createRadialGradient(
                    this.x, this.y, 0,
                    this.x, this.y, this.size * 2
                );
                outerGlow.addColorStop(0, `hsla(${this.color.h}, ${this.color.s}%, ${this.color.l + 10}%, ${dynamicOpacity * 0.3})`);
                outerGlow.addColorStop(0.7, `hsla(${this.color.h + 10}, ${this.color.s - 10}%, ${this.color.l}%, ${dynamicOpacity * 0.1})`);
                outerGlow.addColorStop(1, `hsla(${this.color.h + 20}, ${this.color.s - 20}%, ${this.color.l - 10}%, 0)`);

                ctx.fillStyle = outerGlow;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
                ctx.fill();

                // Main bubble
                const bubbleGradient = ctx.createRadialGradient(
                    this.x - this.size * 0.3, this.y - this.size * 0.3, 0,
                    this.x, this.y, this.size
                );
                bubbleGradient.addColorStop(0, `hsla(0, 0%, 100%, ${dynamicOpacity * 0.4})`);
                bubbleGradient.addColorStop(0.3, `hsla(${this.color.h}, ${this.color.s}%, ${this.color.l + 15}%, ${dynamicOpacity * 0.3})`);
                bubbleGradient.addColorStop(0.7, `hsla(${this.color.h}, ${this.color.s}%, ${this.color.l}%, ${dynamicOpacity * 0.2})`);
                bubbleGradient.addColorStop(1, `hsla(${this.color.h - 10}, ${this.color.s}%, ${this.color.l - 15}%, ${dynamicOpacity * 0.1})`);

                ctx.fillStyle = bubbleGradient;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();

                // Bubble highlight
                const highlight = ctx.createRadialGradient(
                    this.x - this.size * 0.4, this.y - this.size * 0.4, 0,
                    this.x - this.size * 0.2, this.y - this.size * 0.2, this.size * 0.5
                );
                highlight.addColorStop(0, `hsla(0, 0%, 100%, ${dynamicOpacity * 0.8})`);
                highlight.addColorStop(0.5, `hsla(0, 0%, 100%, ${dynamicOpacity * 0.3})`);
                highlight.addColorStop(1, `hsla(0, 0%, 100%, 0)`);

                ctx.fillStyle = highlight;
                ctx.beginPath();
                ctx.arc(this.x - this.size * 0.3, this.y - this.size * 0.3, this.size * 0.4, 0, Math.PI * 2);
                ctx.fill();

                ctx.restore();
            }
        }

        // Twinkling Star class - twinkling stars
        class TwinklingStar {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2.5 + 0.5;
                this.twinkleSpeed = Math.random() * 0.08 + 0.02;
                this.time = Math.random() * Math.PI * 2;
                this.brightness = Math.random() * 0.9 + 0.1;
                
                // More diverse star colors
                const starTypes = ['blue-white', 'white', 'yellow-white', 'orange', 'red', 'blue'];
                this.starType = starTypes[Math.floor(Math.random() * starTypes.length)];
                
                // Some stars are brighter than others
                this.isMainSequence = Math.random() > 0.8;
                if (this.isMainSequence) {
                    this.size *= 1.5;
                    this.brightness *= 1.3;
                }
            }

            update() {
                this.time += this.twinkleSpeed;
            }

            draw() {
                ctx.save();

                const twinkle = Math.sin(this.time) * 0.4 + 0.6;
                const alpha = this.brightness * twinkle;

                // Realistic star colors by spectral classes
                let starColor, coreColor;
                switch (this.starType) {
                    case 'blue-white':
                        starColor = `rgba(155, 176, 255, ${alpha})`;
                        coreColor = `rgba(200, 210, 255, ${alpha})`;
                        break;
                    case 'white':
                        starColor = `rgba(255, 255, 255, ${alpha})`;
                        coreColor = `rgba(255, 255, 255, ${alpha})`;
                        break;
                    case 'yellow-white':
                        starColor = `rgba(255, 244, 234, ${alpha})`;
                        coreColor = `rgba(255, 250, 240, ${alpha})`;
                        break;
                    case 'orange':
                        starColor = `rgba(255, 209, 148, ${alpha})`;
                        coreColor = `rgba(255, 230, 180, ${alpha})`;
                        break;
                    case 'red':
                        starColor = `rgba(255, 181, 108, ${alpha})`;
                        coreColor = `rgba(255, 200, 140, ${alpha})`;
                        break;
                    case 'blue':
                        starColor = `rgba(162, 192, 255, ${alpha})`;
                        coreColor = `rgba(180, 200, 255, ${alpha})`;
                        break;
                    default:
                        starColor = `rgba(255, 255, 255, ${alpha})`;
                        coreColor = `rgba(255, 255, 255, ${alpha})`;
                }

                // Star glow with correct colors
                const glowSize = this.isMainSequence ? this.size * 6 : this.size * 4;
                const starGlow = ctx.createRadialGradient(
                    this.x, this.y, 0,
                    this.x, this.y, glowSize
                );
                
                starGlow.addColorStop(0, coreColor);
                starGlow.addColorStop(0.3, starColor);
                starGlow.addColorStop(0.6, starColor.replace(/[\d.]+\)/, `${alpha * 0.4})`));
                starGlow.addColorStop(1, starColor.replace(/[\d.]+\)/, '0)'));

                ctx.fillStyle = starGlow;
                ctx.beginPath();
                ctx.arc(this.x, this.y, glowSize, 0, Math.PI * 2);
                ctx.fill();

                // Bright core звезды
                ctx.fillStyle = coreColor;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size * 0.8, 0, Math.PI * 2);
                ctx.fill();

                // Diffraction rays for bright stars
                if (this.isMainSequence && twinkle > 0.6) {
                    ctx.strokeStyle = starColor;
                    ctx.lineWidth = 0.8;
                    ctx.globalAlpha = alpha * 0.7;

                    const rayLength = this.size * 8;
                    
                    // Main rays (cross)
                    ctx.beginPath();
                    ctx.moveTo(this.x - rayLength, this.y);
                    ctx.lineTo(this.x + rayLength, this.y);
                    ctx.moveTo(this.x, this.y - rayLength);
                    ctx.lineTo(this.x, this.y + rayLength);
                    ctx.stroke();
                    
                    // Diagonal rays (weaker)
                    ctx.globalAlpha = alpha * 0.4;
                    ctx.lineWidth = 0.5;
                    const diagLength = rayLength * 0.7;
                    ctx.beginPath();
                    ctx.moveTo(this.x - diagLength, this.y - diagLength);
                    ctx.lineTo(this.x + diagLength, this.y + diagLength);
                    ctx.moveTo(this.x - diagLength, this.y + diagLength);
                    ctx.lineTo(this.x + diagLength, this.y - diagLength);
                    ctx.stroke();
                }

                ctx.restore();
            }
        }

        // Solar Energy Particle class - dynamic solar particles without trail
        class SolarParticle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 6 + 3;
                this.speedX = (Math.random() - 0.5) * 2;
                this.speedY = (Math.random() - 0.5) * 2;
                this.life = 1;
                this.decay = Math.random() * 0.008 + 0.002;
                this.pulse = Math.random() * Math.PI * 2;
                this.pulseSpeed = Math.random() * 0.1 + 0.05;

                // Solar colors
                const solarColors = [
                    { h: 45, s: 100, l: 70 },   // Orange
                    { h: 35, s: 95, l: 65 },    // Red-orange
                    { h: 55, s: 90, l: 75 },    // Yellow-orange
                    { h: 25, s: 85, l: 60 },    // Red
                    { h: 60, s: 100, l: 80 },   // Yellow
                ];
                this.color = solarColors[Math.floor(Math.random() * solarColors.length)];
            }

            update() {
                // Organic movement without trail
                this.x += this.speedX;
                this.y += this.speedY;
                this.life -= this.decay;
                this.pulse += this.pulseSpeed;

                // Bounce off edges
                if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
                if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;

                // Particle respawn
                if (this.life <= 0) {
                    this.x = Math.random() * canvas.width;
                    this.y = Math.random() * canvas.height;
                    this.life = 1;
                    this.speedX = (Math.random() - 0.5) * 2;
                    this.speedY = (Math.random() - 0.5) * 2;
                }
            }

            draw() {
                ctx.save();

                const pulseSize = this.size + Math.sin(this.pulse) * 2;
                const alpha = this.life * 0.9;

                // Outer glow
                const outerGlow = ctx.createRadialGradient(
                    this.x, this.y, 0,
                    this.x, this.y, pulseSize * 6
                );
                outerGlow.addColorStop(0, `hsla(${this.color.h}, ${this.color.s}%, ${this.color.l + 15}%, ${alpha * 0.4})`);
                outerGlow.addColorStop(0.3, `hsla(${this.color.h + 10}, ${this.color.s - 10}%, ${this.color.l}%, ${alpha * 0.2})`);
                outerGlow.addColorStop(1, `hsla(${this.color.h + 20}, ${this.color.s - 20}%, ${this.color.l - 10}%, 0)`);

                ctx.fillStyle = outerGlow;
                ctx.beginPath();
                ctx.arc(this.x, this.y, pulseSize * 6, 0, Math.PI * 2);
                ctx.fill();

                // Main particle
                const mainGradient = ctx.createRadialGradient(
                    this.x - pulseSize * 0.3, this.y - pulseSize * 0.3, 0,
                    this.x, this.y, pulseSize * 2
                );
                mainGradient.addColorStop(0, `hsla(0, 0%, 100%, ${alpha * 0.8})`);
                mainGradient.addColorStop(0.2, `hsla(${this.color.h + 5}, ${this.color.s}%, ${Math.min(95, this.color.l + 25)}%, ${alpha * 0.7})`);
                mainGradient.addColorStop(0.6, `hsla(${this.color.h}, ${this.color.s}%, ${this.color.l}%, ${alpha * 0.5})`);
                mainGradient.addColorStop(1, `hsla(${this.color.h - 10}, ${this.color.s}%, ${Math.max(30, this.color.l - 20)}%, ${alpha * 0.2})`);

                ctx.fillStyle = mainGradient;
                ctx.beginPath();
                ctx.arc(this.x, this.y, pulseSize * 2, 0, Math.PI * 2);
                ctx.fill();

                // Bright core
                const coreSize = pulseSize * 0.4;
                const coreGradient = ctx.createRadialGradient(
                    this.x - coreSize * 0.4, this.y - coreSize * 0.4, 0,
                    this.x, this.y, coreSize
                );
                coreGradient.addColorStop(0, `hsla(0, 0%, 100%, ${alpha})`);
                coreGradient.addColorStop(0.5, `hsla(${this.color.h + 15}, 90%, 85%, ${alpha * 0.8})`);
                coreGradient.addColorStop(1, `hsla(${this.color.h}, 80%, 70%, ${alpha * 0.3})`);

                ctx.fillStyle = coreGradient;
                ctx.beginPath();
                ctx.arc(this.x, this.y, coreSize, 0, Math.PI * 2);
                ctx.fill();

                ctx.restore();
            }
        }

        // Enhanced Wave class with more complex animation
        class Wave {
            constructor(amplitude, frequency, phase, color, yOffset = 0, gradient = false) {
                this.amplitude = amplitude;
                this.frequency = frequency;
                this.phase = phase;
                this.color = color;
                this.yOffset = yOffset;
                this.gradient = gradient;
                this.time = 0;
                this.pulseTime = 0;
                this.breatheAmplitude = amplitude * 0.3;
            }

            update() {
                // Slower, more organic movement
                this.time += 0.008; // Reduced from 0.02 to make it slower
                this.pulseTime += 0.005; // Additional pulse animation
            }

            draw() {
                ctx.save();

                // Dynamic amplitude with breathing effect
                const breathingAmplitude = this.amplitude +
                    Math.sin(this.pulseTime) * this.breatheAmplitude;

                // Create gradient if specified
                if (this.gradient) {
                    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
                    gradient.addColorStop(0, this.color + '40');
                    gradient.addColorStop(0.5, this.color + 'AA');
                    gradient.addColorStop(1, this.color + '40');
                    ctx.strokeStyle = gradient;
                } else {
                    ctx.strokeStyle = this.color;
                }

                ctx.lineWidth = 3;
                ctx.globalAlpha = 0.6;
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';

                // Main wave
                ctx.beginPath();
                for (let x = 0; x <= canvas.width; x += 2) { // Smoother curve with smaller steps
                    const baseY = (canvas.height / 2) + this.yOffset;

                    // Complex wave with multiple harmonics for more organic look
                    const wave1 = Math.sin((x * this.frequency) + (this.time + this.phase)) * breathingAmplitude;
                    const wave2 = Math.sin((x * this.frequency * 2.1) + (this.time * 1.3 + this.phase)) * (breathingAmplitude * 0.3);
                    const wave3 = Math.sin((x * this.frequency * 0.7) + (this.time * 0.8 + this.phase)) * (breathingAmplitude * 0.5);

                    const y = baseY + wave1 + wave2 + wave3;

                    if (x === 0) {
                        ctx.moveTo(x, y);
                    } else {
                        ctx.lineTo(x, y);
                    }
                }
                ctx.stroke();

                // Add a subtle glow effect
                ctx.globalAlpha = 0.2;
                ctx.lineWidth = 8;
                ctx.stroke();
                ctx.restore();
            }
        }

        // Synthwave Grid class
        class SynthwaveGrid {
            constructor() {
                // Responsive grid sizing based on screen width
                const isMobile = canvas.width < 768;
                this.gridSize = isMobile ? 40 : 50;
                this.perspective = isMobile ? 300 : 400;
                this.time = 0;
                this.mountains = [];
                
                // Adaptive mountain points based on screen size
                const mountainCount = isMobile ? 40 : 80;
                for (let i = 0; i < mountainCount; i++) {
                    this.mountains.push({
                        x: (i / (mountainCount - 1)) * canvas.width,
                        height: Math.random() * (isMobile ? 100 : 150) + (isMobile ? 30 : 50),
                        phase: Math.random() * Math.PI * 2
                    });
                }
            }

            update() {
                this.time += 0.01;
            }

            draw() {
                ctx.save();
                
                // Draw perspective grid
                this.drawGrid();
                
                // Draw mountains
                this.drawMountains();
                
                // Draw sun
                this.drawSun();
                
                // Draw stars
                this.drawStars();
                
                ctx.restore();
            }

            drawGrid() {
                const isMobile = canvas.width < 768;
                const horizon = canvas.height * (isMobile ? 0.7 : 0.65);
                const vanishingPoint = canvas.width / 2;
                
                ctx.strokeStyle = '#ff006e';
                ctx.lineWidth = isMobile ? 1.2 : 1.5;
                ctx.globalAlpha = 0.8;
                ctx.lineCap = 'round';

                // Horizontal perspective lines - mobile optimized
                const numHorizontalLines = isMobile ? 12 : 20;
                for (let i = 0; i < numHorizontalLines; i++) {
                    const progress = i / (numHorizontalLines - 1);
                    const exponentialProgress = Math.pow(progress, isMobile ? 1.3 : 1.5);
                    const y = horizon + exponentialProgress * (canvas.height - horizon);
                    
                    if (y > canvas.height) break;
                    
                    // Mobile-responsive perspective scaling
                    const distanceFromHorizon = y - horizon;
                    const maxDistance = canvas.height - horizon;
                    const perspectiveScale = 0.05 + (distanceFromHorizon / maxDistance) * (isMobile ? 1.0 : 1.2);
                    
                    const lineWidth = canvas.width * perspectiveScale * (isMobile ? 1.2 : 1.5);
                    const leftX = vanishingPoint - lineWidth / 2;
                    const rightX = vanishingPoint + lineWidth / 2;
                    
                    // Glow effect - reduced on mobile for performance
                    const glowIntensity = perspectiveScale;
                    ctx.globalAlpha = 0.4 + glowIntensity * (isMobile ? 0.3 : 0.4);
                    ctx.lineWidth = (isMobile ? 0.8 : 1) + glowIntensity * (isMobile ? 1 : 1.5);
                    
                    ctx.beginPath();
                    ctx.moveTo(leftX, y);
                    ctx.lineTo(rightX, y);
                    ctx.stroke();
                }

                // Vertical perspective lines - mobile responsive
                const screenWidth = canvas.width;
                const gridSpacing = isMobile ? 60 : 80;
                const numVerticalLines = Math.ceil(screenWidth / gridSpacing) * (isMobile ? 1.5 : 2) + (isMobile ? 6 : 10);
                const centerIndex = Math.floor(numVerticalLines / 2);
                
                for (let i = 0; i < numVerticalLines; i++) {
                    const offset = (i - centerIndex) * gridSpacing;
                    const startX = vanishingPoint + offset * (isMobile ? 0.2 : 0.15);
                    const endX = vanishingPoint + offset * (isMobile ? 1.8 : 2.0);
                    
                    // Mobile-friendly clipping
                    if (endX < -screenWidth * 0.5 || endX > screenWidth * 1.5) continue;
                    
                    // Fade lines - simplified on mobile
                    const distanceFromCenter = Math.abs(i - centerIndex);
                    const fadeAlpha = Math.max(0.15, 1 - (distanceFromCenter / centerIndex) * 0.6);
                    
                    ctx.globalAlpha = fadeAlpha * (isMobile ? 0.6 : 0.7);
                    ctx.lineWidth = isMobile ? 1.0 : 1.2;
                    
                    ctx.beginPath();
                    ctx.moveTo(startX, horizon);
                    ctx.lineTo(endX, canvas.height);
                    ctx.stroke();
                }

                // Animated scan lines - optional on mobile
                if (!isMobile || canvas.width > 480) {
                    const scanLineY = horizon + Math.sin(this.time * 2) * (isMobile ? 15 : 20);
                    ctx.strokeStyle = '#00ffff';
                    ctx.globalAlpha = 0.2 + Math.sin(this.time * 3) * 0.15;
                    ctx.lineWidth = isMobile ? 1.5 : 2;
                    
                    ctx.beginPath();
                    ctx.moveTo(0, scanLineY);
                    ctx.lineTo(canvas.width, scanLineY);
                    ctx.stroke();
                }
            }

            drawMountains() {
                ctx.fillStyle = '#000';
                ctx.globalAlpha = 0.8;
                
                ctx.beginPath();
                ctx.moveTo(0, canvas.height * 0.6);
                
                this.mountains.forEach((mountain, i) => {
                    const wave = Math.sin(this.time * 2 + mountain.phase) * 10;
                    ctx.lineTo(mountain.x, canvas.height * 0.6 - mountain.height + wave);
                });
                
                ctx.lineTo(canvas.width, canvas.height * 0.6);
                ctx.lineTo(canvas.width, canvas.height);
                ctx.lineTo(0, canvas.height);
                ctx.closePath();
                ctx.fill();

                // Mountain outline
                ctx.strokeStyle = '#ff006e';
                ctx.lineWidth = 2;
                ctx.globalAlpha = 0.8;
                ctx.beginPath();
                ctx.moveTo(0, canvas.height * 0.6);
                this.mountains.forEach((mountain) => {
                    const wave = Math.sin(this.time * 2 + mountain.phase) * 10;
                    ctx.lineTo(mountain.x, canvas.height * 0.6 - mountain.height + wave);
                });
                ctx.stroke();
            }

            drawSun() {
                const isMobile = canvas.width < 768;
                const sunX = canvas.width / 2;
                const sunY = canvas.height * (isMobile ? 0.3 : 0.25);
                const sunRadius = isMobile ? 60 : 100;
                const pulse = Math.sin(this.time * 1.5) * 0.1 + 1;
                
                // Outer glow
                const outerGlow = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, sunRadius * 3);
                outerGlow.addColorStop(0, 'rgba(255, 255, 0, 0.1)');
                outerGlow.addColorStop(0.3, 'rgba(255, 140, 0, 0.05)');
                outerGlow.addColorStop(0.6, 'rgba(255, 0, 110, 0.02)');
                outerGlow.addColorStop(1, 'transparent');
                
                ctx.fillStyle = outerGlow;
                ctx.globalAlpha = 0.8 * pulse;
                ctx.beginPath();
                ctx.arc(sunX, sunY, sunRadius * 3, 0, Math.PI * 2);
                ctx.fill();
                
                // Main sun gradient
                const gradient = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, sunRadius * pulse);
                gradient.addColorStop(0, '#ffff88');
                gradient.addColorStop(0.2, '#ffdd00');
                gradient.addColorStop(0.5, '#ff8c00');
                gradient.addColorStop(0.8, '#ff006e');
                gradient.addColorStop(1, '#8b0040');
                
                ctx.fillStyle = gradient;
                ctx.globalAlpha = 0.9;
                ctx.beginPath();
                ctx.arc(sunX, sunY, sunRadius * pulse, 0, Math.PI * 2);
                ctx.fill();

                // Animated sun stripes
                ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
                ctx.lineWidth = 3;
                ctx.globalAlpha = 0.7;
                
                const numStripes = 12;
                for (let i = 0; i < numStripes; i++) {
                    const stripeY = sunY - sunRadius * pulse + (i * sunRadius * 2 * pulse) / numStripes;
                    const waveOffset = Math.sin(this.time * 2 + i * 0.5) * 5;
                    
                    ctx.beginPath();
                    ctx.moveTo(sunX - sunRadius * pulse, stripeY + waveOffset);
                    ctx.lineTo(sunX + sunRadius * pulse, stripeY + waveOffset);
                    ctx.stroke();
                }

                // Sun reflection on grid
                ctx.strokeStyle = '#ff006e';
                ctx.globalAlpha = 0.2;
                ctx.lineWidth = 1;
                
                const reflectionY = canvas.height * 0.65 + 10;
                ctx.beginPath();
                ctx.arc(sunX, reflectionY, sunRadius * 0.3, 0, Math.PI, true);
                ctx.stroke();
            }

            drawStars() {
                const isMobile = canvas.width < 768;
                
                // Background stars - reduced count on mobile
                const starCount = isMobile ? 80 : 150;
                for (let i = 0; i < starCount; i++) {
                    const x = (i * 137.5) % canvas.width;
                    const y = (i * 73.7) % (canvas.height * 0.6);
                    const twinkle = Math.sin(this.time * 3 + i) * 0.5 + 0.5;
                    const size = (isMobile ? 0.4 : 0.5) + Math.sin(i) * (isMobile ? 0.3 : 0.5);
                    
                    // Different star colors
                    const colors = ['#ffffff', '#ffccff', '#ccffff', '#ffffcc'];
                    const colorIndex = i % colors.length;
                    
                    ctx.fillStyle = colors[colorIndex];
                    ctx.globalAlpha = twinkle * (isMobile ? 0.5 : 0.6);
                    ctx.beginPath();
                    ctx.arc(x, y, size, 0, Math.PI * 2);
                    ctx.fill();
                }

                // Bright accent stars - fewer on mobile
                const accentStarCount = isMobile ? 10 : 20;
                for (let i = 0; i < accentStarCount; i++) {
                    const x = (i * 234.7) % canvas.width;
                    const y = (i * 156.3) % (canvas.height * 0.5);
                    const twinkle = Math.sin(this.time * 2 + i * 0.5) * 0.3 + 0.7;
                    
                    ctx.strokeStyle = '#ffffff';
                    ctx.lineWidth = isMobile ? 0.8 : 1;
                    ctx.globalAlpha = twinkle * (isMobile ? 0.6 : 0.8);
                    
                    // Draw cross pattern - smaller on mobile
                    const size = (isMobile ? 2 : 3) + Math.sin(this.time + i) * (isMobile ? 0.5 : 1);
                    ctx.beginPath();
                    ctx.moveTo(x - size, y);
                    ctx.lineTo(x + size, y);
                    ctx.moveTo(x, y - size);
                    ctx.lineTo(x, y + size);
                    ctx.stroke();
                    
                    // Center dot
                    ctx.fillStyle = '#ffffff';
                    ctx.beginPath();
                    ctx.arc(x, y, isMobile ? 0.8 : 1, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
        }

        // Initialize particles based on variant
        if (variant === 'neural') {
            for (let i = 0; i < 50; i++) { // Increased from 25 to 50 (2x)
                particles.push(new NeuralNode());
            }
        } else if (variant === 'matrix') {
            for (let i = 0; i < 50; i++) {
                particles.push(new MatrixChar());
            }
        } else if (variant === 'ai-particles') {
            for (let i = 0; i < 35; i++) {
                particles.push(new AIParticle());
            }
        } else if (variant === 'floating-orbs') {
            for (let i = 0; i < 15; i++) {
                particles.push(new FloatingOrb());
            }
        } else if (variant === 'light-orbs') {
            for (let i = 0; i < 20; i++) {
                particles.push(new FloatingLightOrb());
            }
        } else if (variant === 'neon-cyber') {
            for (let i = 0; i < 18; i++) {
                particles.push(new NeonCyberOrb());
            }
        } else if (variant === 'cosmic-nebula') {
            // Create nebula layers
            particles = [
                new NebulaLayer(0),
                new NebulaLayer(1), 
                new NebulaLayer(2)
            ];
        } else if (variant === 'solar-particles') {
            for (let i = 0; i < 25; i++) {
                particles.push(new FloatingBubble());
            }
        } else if (variant === 'waves') {
            for (let i = 0; i < 30; i++) {
                particles.push(new FloatingLightOrb());
            }
        } else if (variant === 'synthwave-retro') {
            particles.push(new SynthwaveGrid());
        } else if (variant === 'solar-particles') {
            for (let i = 0; i < 25; i++) {
                particles.push(new SolarParticle());
            }
        } else if (variant === 'waves') {
            particles = [
                // Larger, slower waves with solar colors
                new Wave(80, 0.006, 0, '#ff6b35', -60, true),           // Orange wave (top)
                new Wave(60, 0.008, Math.PI / 3, '#ff8e53', -20, true), // Light orange (mid-top)
                new Wave(70, 0.005, Math.PI / 2, '#ffa726', 20, true),  // Amber (mid-bottom)
                new Wave(50, 0.009, Math.PI, '#ffb74d', 60, true),      // Light amber (bottom)
                new Wave(40, 0.007, Math.PI * 1.2, '#ffcc80', 100, false), // Peach accent
                new Wave(35, 0.011, Math.PI * 1.8, '#ff8a65', -100, false) // Coral accent
            ];
        }

        // Draw static background elements for neural variant
        const drawStaticBackground = () => {
            if (variant !== 'neural') return;
            
            ctx.save();
            
            // Coordinate grid in corners
            ctx.strokeStyle = 'rgba(100, 116, 139, 0.1)';
            ctx.lineWidth = 0.5;
            ctx.font = '8px monospace';
            ctx.fillStyle = 'rgba(100, 116, 139, 0.3)';
            
            // Coordinate grid
            const gridSize = 50;
            for (let x = 0; x < canvas.width; x += gridSize) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, canvas.height);
                ctx.stroke();
            }
            for (let y = 0; y < canvas.height; y += gridSize) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(canvas.width, y);
                ctx.stroke();
            }
            
            // Technical labels in corners
            ctx.fillText('NEURAL_NET_v2.1', 10, 20);
            ctx.fillText('STATUS: ACTIVE', 10, 35);
            ctx.fillText('NODES: 85', 10, 50);
            
            ctx.fillText(`RES: ${canvas.width}x${canvas.height}`, canvas.width - 120, 20);
            ctx.fillText('AI_CORE: ONLINE', canvas.width - 120, 35);
            ctx.fillText('SYNC: 99.7%', canvas.width - 120, 50);
            
            // Central HUD element
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            
            ctx.strokeStyle = 'rgba(139, 92, 246, 0.15)';
            ctx.lineWidth = 1;
            ctx.setLineDash([5, 5]);
            
            // Large central circle
            ctx.beginPath();
            ctx.arc(centerX, centerY, 200, 0, Math.PI * 2);
            ctx.stroke();
            
            // Medium circle
            ctx.beginPath();
            ctx.arc(centerX, centerY, 120, 0, Math.PI * 2);
            ctx.stroke();
            
            // Cross-shaped lines
            ctx.setLineDash([]);
            ctx.strokeStyle = 'rgba(139, 92, 246, 0.08)';
            ctx.beginPath();
            ctx.moveTo(centerX - 250, centerY);
            ctx.lineTo(centerX + 250, centerY);
            ctx.moveTo(centerX, centerY - 250);
            ctx.lineTo(centerX, centerY + 250);
            ctx.stroke();
            
            // Corner indicators
            const corners = [
                {x: 50, y: 50, text: 'NW_SECTOR'},
                {x: canvas.width - 50, y: 50, text: 'NE_SECTOR'},
                {x: 50, y: canvas.height - 50, text: 'SW_SECTOR'},
                {x: canvas.width - 50, y: canvas.height - 50, text: 'SE_SECTOR'}
            ];
            
            corners.forEach(corner => {
                ctx.strokeStyle = 'rgba(59, 130, 246, 0.2)';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.arc(corner.x, corner.y, 15, 0, Math.PI * 2);
                ctx.stroke();
                
                ctx.fillStyle = 'rgba(59, 130, 246, 0.4)';
                ctx.font = '6px monospace';
                ctx.textAlign = 'center';
                ctx.fillText(corner.text, corner.x, corner.y + 25);
            });
            
            ctx.restore();
        };
        
        // Animation loop
        const animate = () => {
            // Create fade effect for neural network - remove ugly trail
            if (variant === 'neural') {
                // Full clear for clean look without trails
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                // Draw static elements
                drawStaticBackground();
            } else if (variant === 'matrix') {
                ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            } else if (variant === 'cosmic-nebula') {
                // For nebula use very light darkening for smoothness
                ctx.fillStyle = 'rgba(13, 20, 33, 0.02)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            } else {
                // Full screen clear for all other variants - remove trails
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }

            // Draw connections first for neural network
            if (variant === 'neural') {
                particles.forEach(particle => {
                    particle.drawConnections(particles);
                });
            }

            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });

            animationId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            if (animationId) {
                cancelAnimationFrame(animationId);
            }
        };
    }, [variant]);

    const getBackgroundStyle = () => {
        switch (variant) {
            case 'neural':
                return 'linear-gradient(135deg, #1e293b 0%, #312e81 25%, #4c1d95 50%, #334155 75%, #64748b 100%)';
            case 'matrix':
                return 'linear-gradient(135deg, #000000 0%, #001100 50%, #002200 100%)';
            case 'ai-particles':
                return 'linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%)';
            case 'light-orbs':
                return 'linear-gradient(135deg, #fefce8 0%, #fef3c7 25%, #fde68a 50%, #fed7aa 75%, #fecaca 100%)';
            case 'neon-cyber':
                return 'linear-gradient(135deg, #0a0a0a 0%, #1a0a2e 25%, #16213e 50%, #0f3460 75%, #0e4b99 100%)';
            case 'cosmic-nebula':
                return 'radial-gradient(ellipse at center, #0d1421 0%, #1a0a2e 25%, #16213e 50%, #0f1419 75%, #000000 100%)';
            case 'solar-particles':
                return 'linear-gradient(135deg, #fff8e1 0%, #ffecb3 20%, #ffe082 40%, #ffcc02 60%, #ff8f00 80%, #e65100 100%)';
            case 'waves':
                return 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 25%, #ffcc80 50%, #ffb74d 75%, #ff8f00 100%)';
            case 'synthwave-retro':
                return 'linear-gradient(180deg, #0a0a0a 0%, #1a0a2e 30%, #2d1b69 60%, #ff006e 100%)';
            default:
                return 'transparent';
        }
    };

    // Ready-made Starfield effect from CodePen
    if (variant === 'cosmic-css') {
        return (
            <div className="cosmic-background">
                <div id="stars"></div>
                <div id="stars2"></div>
                <div id="stars3"></div>
            </div>
        );
    }

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none"
            style={{
                background: getBackgroundStyle(),
                willChange: 'transform',
                transform: 'translate3d(0, 0, 0)',
                backfaceVisibility: 'hidden',
                zIndex: -1,
                top: 0,
                left: 0,
                width: '100%',
                height: '100%'
            }}
        />
    );
};

export default AnimatedBackground;
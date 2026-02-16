// Chiptune March — Retro 8-bit style using oscillators
const square = Oscillator({type: 'square', attack: 0.01, release: 0.1})
const pulse = Oscillator({type: 'square', attack: 0.01, release: 0.05, mixer: 0.6})
const noise = Oscillator({type: 'sawtooth', attack: 0.005, release: 0.05, mixer: 0.3})
track.beatsPerMinute = 160

melody(square)
harmony(pulse)
bass(pulse)

track melody(inst) {
    track.instrument = inst
    track.duration = 1/8

    // Main theme
    C5 C5 . C5  E5 G5 . .
    G4 . . .    . . . .
    C5 C5 . C5  E5 G5 . .
    A5 /2       G5 /2

    // B section
    F5 F5 . F5  E5 E5 . E5
    D5 D5 . D5  C5 /2 . .
    D5 E5 F5 .  E5 C5 D5 .
    C5 /1
}

track harmony(inst) {
    track.instrument = inst
    track.duration = 1/4

    [E4, G4] /2  [E4, G4] /2
    [D4, G4] /2  [D4, G4] /2
    [E4, G4] /2  [E4, G4] /2
    [F4, A4] /2  [E4, G4] /2

    [F4, A4] /2  [E4, G4] /2
    [F4, A4] /2  [E4, G4] /2
    [F4, A4] /2  [E4, G4] /2
    [E4, G4] /1
}

track bass(inst) {
    track.instrument = inst
    track.duration = 1/4

    C3 /2  C3 /2
    G2 /2  G2 /2
    C3 /2  C3 /2
    F2 /2  C3 /2

    F2 /2  C3 /2
    F2 /2  C3 /2
    F2 /2  C3 /2
    C3 /1
}

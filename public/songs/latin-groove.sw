// Latin Groove — Nylon guitar, flute, and percussion
const guitar = loadPreset("FluidR3_GM/Acoustic Guitar (nylon)")
const flute = loadPreset("FluidR3_GM/Flute")
const bass = loadPreset("FluidR3_GM/Acoustic Bass")
track.beatsPerMinute = 105

rhythm_guitar(guitar)
flute_melody(flute)
bass_line(bass)

track rhythm_guitar(inst) {
    track.instrument = inst
    track.duration = 1/4

    // Bossa-nova style pattern
    for (let i = 0; i < 2; i++) {
        [A3, C4, E4] /4  . /8  [A3, C4, E4] /8
        . /4  [D3, F3, A3] /4
        [D3, F3, A3] /4  . /8  [D3, F3, A3] /8
        . /4  [E3, G#3, B3] /4

        [A3, C4, E4] /4  . /8  [A3, C4, E4] /8
        . /4  [F3, A3, C4] /4
        [E3, G#3, B3] /2  . /2
    }
}

track flute_melody(inst) {
    track.instrument = inst
    track.duration = 1/4

    . /2
    E5 /4  F5 /8  E5 /8
    D5 /4  C5 /4
    B4 /2

    A4 /4  B4 /4
    C5 /4  D5 /4
    E5 /2
    . /2

    E5 /4  D5 /4
    C5 /4  B4 /4
    A4 /1

    . /1
}

track bass_line(inst) {
    track.instrument = inst
    track.duration = 1/4

    for (let i = 0; i < 2; i++) {
        A2 /2  E2 /2
        D2 /2  A2 /2
        A2 /2  C3 /2
        E2 /1
    }
}

// Ambient Drift — Ethereal pads and textures
const warmPad = loadPreset("Aspirin/Pad 2 (warm)")
const newAge = loadPreset("Aspirin/Pad 1 (new age)")
const choir = loadPreset("Aspirin/Choir Aahs")
track.beatsPerMinute = 60
track.tuningPitch = 432

pad_layer(warmPad)
shimmer(newAge)
voices(choir)

track pad_layer(inst) {
    track.instrument = inst
    track.duration = 2

    // Long evolving chords
    [A2, E3, A3] /4
    [D3, A3, D4] /4
    [E3, B3, E4] /4
    [A2, E3, A3] /4
}

track shimmer(inst) {
    track.instrument = inst
    track.duration = 1

    // Gentle movement over pads
    . /2
    E4 /2
    A4 /4
    . /2
    F#4 /2
    E4 /4
    . /2
    A4 /2
}

track voices(inst) {
    track.instrument = inst
    track.duration = 1

    // Sparse choir accents
    . /4
    A4 /4
    . /4
    E4 /4
}

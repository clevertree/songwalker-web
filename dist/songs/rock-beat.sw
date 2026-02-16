// Rock Beat — Drum kit + bass + guitar, multi-track
const drums = loadPreset("FluidR3_GM/Standard")
const bass = loadPreset("FluidR3_GM/Fingered Bass")
const guitar = loadPreset("FluidR3_GM/Overdriven Guitar")
track.beatsPerMinute = 120

beat(drums)
bassline(bass)
riff(guitar)

track beat(kit) {
    track.instrument = kit
    track.duration = 1/4

    // C2=Kick, F#2=HiHat, D2=Snare (GM drum map)
    for (let i = 0; i < 4; i++) {
        // Standard rock pattern
        C2 *0.9           F#2 *0.5  /2
        F#2 *0.5          D2 *0.8  /2
        C2 *0.9           F#2 *0.5  /2
        F#2 *0.5          D2 *0.8  /2
    }
}

track bassline(inst) {
    track.instrument = inst
    track.duration = 1/4

    for (let i = 0; i < 4; i++) {
        E2 /2  E2 /4  G2 /4
        A2 /2  A2 /4  B2 /4
    }
}

track riff(inst) {
    track.instrument = inst
    track.duration = 1/8

    for (let i = 0; i < 4; i++) {
        E4 E4 . E4  G4 /4
        A4 A4 . A4  G4 /4
    }
}

// Funk Slap — Slap bass, clavinet, and drums
const clav = loadPreset("FluidR3_GM/Clavinet")
const bass = loadPreset("FluidR3_GM/Slap Bass 1")
const drums = loadPreset("FluidR3_GM/Standard")
track.beatsPerMinute = 100

clavinet(clav)
slap_bass(bass)
groove(drums)

track clavinet(inst) {
    track.instrument = inst
    track.duration = 1/8

    // Funky clavinet riff
    for (let i = 0; i < 2; i++) {
        E4 . E4 . G4 . E4 .
        . A4 . G4 E4 . . .
        E4 . E4 . G4 . A4 .
        G4 E4 . . . . . .
    }
}

track slap_bass(inst) {
    track.instrument = inst
    track.duration = 1/8

    for (let i = 0; i < 2; i++) {
        E2 . . E2 . G2 . .
        A2 . . E2 . . G2 E2
        E2 . . E2 . G2 . .
        A2 . G2 . E2 . . .
    }
}

track groove(kit) {
    track.instrument = kit
    track.duration = 1/8

    // C2=Kick, F#2=HiHat, D2=Snare (GM drum map)
    for (let i = 0; i < 4; i++) {
        C2 F#2 . F#2 D2 F#2 . F#2
    }
}

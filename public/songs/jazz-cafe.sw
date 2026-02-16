// Jazz Café — Smooth jazz combo
const piano = loadPreset("FluidR3_GM/Electric Piano 1")
const bass = loadPreset("FluidR3_GM/Acoustic Bass")
const drums = loadPreset("FluidR3_GM/Standard")
track.beatsPerMinute = 110

comping(piano)
walking_bass(bass)
swing(drums)

track comping(inst) {
    track.instrument = inst
    track.duration = 1/2

    // Dm7 - G7 - Cmaj7 - A7
    [D3, F3, A3, C4] /2  . /4  [D3, F3, A3, C4] /4
    [G3, B3, D4, F4] /2  . /4  [G3, B3, D4, F4] /4
    [C3, E3, G3, B3] /2  . /4  [C3, E3, G3, B3] /4
    [A3, C#4, E4, G4] /2  . /4  [A3, C#4, E4, G4] /4

    // Dm7 - G7 - Cmaj7
    [D3, F3, A3, C4] /2  . /4  [D3, F3, A3, C4] /4
    [G3, B3, D4, F4] /2  . /4  [G3, B3, D4, F4] /4
    [C3, E3, G3, B3] /1
    . /1
}

track walking_bass(inst) {
    track.instrument = inst
    track.duration = 1/4

    D2 F2 A2 F2
    G2 B2 D3 B2
    C2 E2 G2 E2
    A2 C#3 E3 C#3

    D2 F2 A2 F2
    G2 B2 D3 B2
    C2 /2  E2 /2
    C2 /1
}

track swing(kit) {
    track.instrument = kit
    track.duration = 1/4

    // Eb3 = Ride Cymbal 1 (GM drum map)
    for (let i = 0; i < 4; i++) {
        Eb3 *0.4  /4
        Eb3 *0.3  /4
        Eb3 *0.4  /4
        Eb3 *0.3  /4
    }
}

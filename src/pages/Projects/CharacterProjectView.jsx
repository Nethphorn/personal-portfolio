import CharacterScene from '../../components/CharacterScene'

export default function CharacterProjectView() {
  return (
    <CharacterScene
      modelPath="assets/3D_model/risa-falling.glb"
      cameraPosition={[2.86, 0.61, 9.78]}
      defaultPosition={[-4.68, -5.79]}
      defaultSpin={35.5}
      defaultTilt={-4.5}
      scaleDivisor={3.0}
      animationIndex={2}
    />
  )
}

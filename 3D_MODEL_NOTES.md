# 3D Model Integration Notes

## Model Requirements
- **Static pose** (no animation clips) — baked into rest pose
- **Skinned with bones** if you want manual bone animation (head tilt, leg swing)
- **GLB format** (preferred over FBX)

## Common Issues

### 1. T-Pose in Browser (Animation Clip Not Applied)
- **Cause**: The model's pose is stored as an animation clip, not baked into the rest/bind pose.
- **Solution in Blender**: Select armature → Pose Mode → pose the character → `Ctrl+A` → **Apply Pose as Rest Pose** → export GLB.
- **Code workaround**: Use `AnimationMixer` to play the clip every frame.

### 2. FBXLoader Crash (`Cannot read properties of undefined (reading 'curves')`)
- **Cause**: FBX file has malformed animation curve data.
- **Solution**: Avoid FBX. Export as GLB from Blender instead.
- **Code workaround**: Wrap `FBXLoader.parse()` in try-catch — model still loads, animation data is lost.

### 3. Empty / Zero-Mesh GLB (No Visible Model, No Console Errors)
- **Cause**: GLB was corrupted or exported incorrectly.
- **Solution**: Re-export from Blender with correct settings.

### 4. Bones Not Found for Animation
- **Cause**: Bone naming convention differs between rigs.
- **Solution**: Log all bone names via `console.log('Bone:', ch.name)` in the traversal loop, then match against the actual names.

### 5. Model Position/Scale Wrong
- **Solution**: Auto-center with `Box3().setFromObject(model)` and auto-scale with `3.0 / Math.max(size.x, size.y, size.z)`. Adjust the divisor to change scale.

### 6. Manual Bone Animation Fighting with Mixer
- **Problem**: `AnimationMixer` overwrites bone transforms each frame.
- **Solution**: Apply manual rotations AFTER `mixer.update(dt)` in the animate loop.

## Recommended Export Pipeline (Blender)
1. Pose the character
2. Select armature → Pose Mode → `Ctrl+A` → Apply Pose as Rest Pose
3. File → Export → **glTF 2.0 (.glb)**
4. Settings: Include → `Selected Objects` only, no animation data

## Rig Used (Risa Model)
- Custom biped rig with `J_Bip_` prefix
- Key bones: `J_Bip_C_Neck`, `J_Bip_C_Head`, `J_Bip_L_UpperLeg`, `J_Bip_L_LowerLeg`, `J_Bip_R_UpperLeg`, `J_Bip_R_LowerLeg`
- Format: GLB (1.8MB for laying pose)

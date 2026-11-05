import fs from 'fs';
import path from 'path';

const exercises = [
  // --- NONE / HOME BODYWEIGHT (16 Exercises) ---
  {
    name: 'Standard Push-Ups',
    targetMuscle: 'chest',
    equipmentRequired: 'none_home',
    difficulty: 'beginner',
    animationUrl: 'https://assets9.lottiefiles.com/packages/lf20_f1cFsO.json',
    instructions: [
      'Start in a high plank position with hands slightly wider than shoulder-width.',
      'Keep your core tight and back flat.',
      'Lower your chest until it hovers just above the floor.',
      'Push explosively back up to the starting position.'
    ],
    metValue: 3.8,
    defaultSets: 3,
    defaultWorkSeconds: 45,
    defaultRestSeconds: 30
  },
  {
    name: 'Incline Knee Push-Ups',
    targetMuscle: 'chest',
    equipmentRequired: 'none_home',
    difficulty: 'beginner',
    animationUrl: 'https://assets9.lottiefiles.com/packages/lf20_f1cFsO.json',
    instructions: [
      'Place knees on a mat and hands shoulder-width apart on the floor.',
      'Lower your torso while keeping elbows at a 45-degree angle.',
      'Press through your palms to return to the top.'
    ],
    metValue: 3.0,
    defaultSets: 3,
    defaultWorkSeconds: 40,
    defaultRestSeconds: 30
  },
  {
    name: 'Diamond Push-Ups',
    targetMuscle: 'chest',
    equipmentRequired: 'none_home',
    difficulty: 'intermediate',
    animationUrl: 'https://assets9.lottiefiles.com/packages/lf20_f1cFsO.json',
    instructions: [
      'Form a diamond shape with thumbs and index fingers under your chest.',
      'Keep elbows tight to the ribs as you lower down.',
      'Press upward focusing on inner chest and tricep contraction.'
    ],
    metValue: 4.5,
    defaultSets: 3,
    defaultWorkSeconds: 40,
    defaultRestSeconds: 30
  },
  {
    name: 'Decline Push-Ups',
    targetMuscle: 'chest',
    equipmentRequired: 'none_home',
    difficulty: 'advanced',
    animationUrl: 'https://assets9.lottiefiles.com/packages/lf20_f1cFsO.json',
    instructions: [
      'Place feet on an elevated chair or bed and hands on the floor.',
      'Lower chest towards the floor targeting the upper clavicular chest.',
      'Push up firmly.'
    ],
    metValue: 5.0,
    defaultSets: 4,
    defaultWorkSeconds: 40,
    defaultRestSeconds: 30
  },
  {
    name: 'Prone Cobra Lat Extensions',
    targetMuscle: 'back',
    equipmentRequired: 'none_home',
    difficulty: 'beginner',
    animationUrl: 'https://assets5.lottiefiles.com/packages/lf20_9x8kvf7d.json',
    instructions: [
      'Lie face down on the mat with arms extended alongside your hips.',
      'Rotate thumbs toward the ceiling and lift chest and arms off the floor.',
      'Squeeze shoulder blades tightly for 2 seconds before descending.'
    ],
    metValue: 3.2,
    defaultSets: 3,
    defaultWorkSeconds: 45,
    defaultRestSeconds: 20
  },
  {
    name: 'Reverse Snow Angels',
    targetMuscle: 'back',
    equipmentRequired: 'none_home',
    difficulty: 'intermediate',
    animationUrl: 'https://assets5.lottiefiles.com/packages/lf20_9x8kvf7d.json',
    instructions: [
      'Lie face down with forehead gently hovering off the floor.',
      'Sweep arms overhead in a wide arc without letting palms touch the ground.',
      'Engage upper rhomboids and lats throughout the arc.'
    ],
    metValue: 3.5,
    defaultSets: 3,
    defaultWorkSeconds: 45,
    defaultRestSeconds: 25
  },
  {
    name: 'Superman Holds',
    targetMuscle: 'back',
    equipmentRequired: 'none_home',
    difficulty: 'beginner',
    animationUrl: 'https://assets5.lottiefiles.com/packages/lf20_9x8kvf7d.json',
    instructions: [
      'Lie face down with arms and legs fully extended.',
      'Simultaneously lift arms, chest, and thighs off the floor.',
      'Hold at the top engaging erector spinae and glutes.'
    ],
    metValue: 3.0,
    defaultSets: 3,
    defaultWorkSeconds: 35,
    defaultRestSeconds: 25
  },
  {
    name: 'Air Squats',
    targetMuscle: 'legs',
    equipmentRequired: 'none_home',
    difficulty: 'beginner',
    animationUrl: 'https://assets2.lottiefiles.com/packages/lf20_cq0ugcsd.json',
    instructions: [
      'Stand feet shoulder-width apart, toes turned slightly out.',
      'Hinge hips back and bend knees until thighs are parallel to ground.',
      'Drive through midfoot and heels to stand back up tall.'
    ],
    metValue: 4.0,
    defaultSets: 3,
    defaultWorkSeconds: 45,
    defaultRestSeconds: 30
  },
  {
    name: 'Alternating Forward Lunges',
    targetMuscle: 'legs',
    equipmentRequired: 'none_home',
    difficulty: 'beginner',
    animationUrl: 'https://assets2.lottiefiles.com/packages/lf20_cq0ugcsd.json',
    instructions: [
      'Step forward with one leg until both knees are bent at 90 degrees.',
      'Keep front knee directly above front ankle.',
      'Push off front foot to return to standing, alternating sides.'
    ],
    metValue: 4.2,
    defaultSets: 3,
    defaultWorkSeconds: 45,
    defaultRestSeconds: 30
  },
  {
    name: 'Bulgarian Split Squats (Bodyweight)',
    targetMuscle: 'legs',
    equipmentRequired: 'none_home',
    difficulty: 'intermediate',
    animationUrl: 'https://assets2.lottiefiles.com/packages/lf20_cq0ugcsd.json',
    instructions: [
      'Place rear foot on a chair or bench behind you.',
      'Lower hips until front thigh is parallel to the ground.',
      'Drive upward through front heel.'
    ],
    metValue: 4.8,
    defaultSets: 3,
    defaultWorkSeconds: 40,
    defaultRestSeconds: 30
  },
  {
    name: 'Glute Bridge Holds',
    targetMuscle: 'legs',
    equipmentRequired: 'none_home',
    difficulty: 'beginner',
    animationUrl: 'https://assets2.lottiefiles.com/packages/lf20_cq0ugcsd.json',
    instructions: [
      'Lie face up with knees bent and feet flat on the floor.',
      'Drive through your heels to raise your hips until knees, hips and shoulders align.',
      'Squeeze glutes at top.'
    ],
    metValue: 3.5,
    defaultSets: 3,
    defaultWorkSeconds: 45,
    defaultRestSeconds: 20
  },
  {
    name: 'Pike Push-Ups',
    targetMuscle: 'shoulders',
    equipmentRequired: 'none_home',
    difficulty: 'intermediate',
    animationUrl: 'https://assets6.lottiefiles.com/packages/lf20_k9w2x9lb.json',
    instructions: [
      'Start in a downward dog yoga posture with hips high in the air.',
      'Bend elbows and lower crown of head toward floor between hands.',
      'Push back up targeting anterior deltoids and triceps.'
    ],
    metValue: 4.5,
    defaultSets: 3,
    defaultWorkSeconds: 40,
    defaultRestSeconds: 30
  },
  {
    name: 'Arm Circles Shoulder Burner',
    targetMuscle: 'shoulders',
    equipmentRequired: 'none_home',
    difficulty: 'beginner',
    animationUrl: 'https://assets6.lottiefiles.com/packages/lf20_k9w2x9lb.json',
    instructions: [
      'Extend arms straight out to sides at shoulder height.',
      'Make controlled small forward circles for 20s, then reverse for 20s.',
      'Keep shoulder blades engaged.'
    ],
    metValue: 3.0,
    defaultSets: 3,
    defaultWorkSeconds: 40,
    defaultRestSeconds: 20
  },
  {
    name: 'Tricep Bench/Chair Dips',
    targetMuscle: 'arms',
    equipmentRequired: 'none_home',
    difficulty: 'beginner',
    animationUrl: 'https://assets3.lottiefiles.com/packages/lf20_bkm2kflj.json',
    instructions: [
      'Sit on edge of a stable chair or couch, grip edge with hands.',
      'Slide hips forward off chair and bend elbows to 90 degrees.',
      'Press through palms to lockout arms.'
    ],
    metValue: 3.8,
    defaultSets: 3,
    defaultWorkSeconds: 45,
    defaultRestSeconds: 25
  },
  {
    name: 'Bicycle Crunches',
    targetMuscle: 'core',
    equipmentRequired: 'none_home',
    difficulty: 'beginner',
    animationUrl: 'https://assets4.lottiefiles.com/packages/lf20_m4j30v5p.json',
    instructions: [
      'Lie face up with hands behind head and legs lifted in tabletop.',
      'Rotate torso to bring opposite elbow to opposite knee while extending other leg.',
      'Alternate fluidly without pulling on your neck.'
    ],
    metValue: 3.8,
    defaultSets: 3,
    defaultWorkSeconds: 45,
    defaultRestSeconds: 20
  },
  {
    name: 'High Plank Isometric Hold',
    targetMuscle: 'core',
    equipmentRequired: 'none_home',
    difficulty: 'beginner',
    animationUrl: 'https://assets4.lottiefiles.com/packages/lf20_m4j30v5p.json',
    instructions: [
      'Place palms directly under shoulders, legs straight back.',
      'Brace abdomen as if about to be punched.',
      'Maintain a rigid straight line from crown of head to heels.'
    ],
    metValue: 3.5,
    defaultSets: 3,
    defaultWorkSeconds: 45,
    defaultRestSeconds: 25
  },
  // CARDIO / FULL BODY (MET >= 5.0 for Balance Boost)
  {
    name: 'Burpees with Tuck',
    targetMuscle: 'cardio_full',
    equipmentRequired: 'none_home',
    difficulty: 'advanced',
    animationUrl: 'https://assets1.lottiefiles.com/packages/lf20_7x2v1x9b.json',
    instructions: [
      'From standing, drop into a squat and place hands on floor.',
      'Jump feet back into plank, perform a push-up.',
      'Jump feet forward and leap explosively into the air.'
    ],
    metValue: 8.5,
    defaultSets: 3,
    defaultWorkSeconds: 40,
    defaultRestSeconds: 30
  },
  {
    name: 'Jumping Jacks Cardio Blast',
    targetMuscle: 'cardio_full',
    equipmentRequired: 'none_home',
    difficulty: 'beginner',
    animationUrl: 'https://assets1.lottiefiles.com/packages/lf20_7x2v1x9b.json',
    instructions: [
      'Stand upright with arms at your sides.',
      'Jump feet out to the sides while raising arms overhead in sync.',
      'Land softly on balls of feet and return to starting position.'
    ],
    metValue: 6.0,
    defaultSets: 3,
    defaultWorkSeconds: 50,
    defaultRestSeconds: 20
  },
  {
    name: 'High Knees Sprint in Place',
    targetMuscle: 'cardio_full',
    equipmentRequired: 'none_home',
    difficulty: 'beginner',
    animationUrl: 'https://assets1.lottiefiles.com/packages/lf20_7x2v1x9b.json',
    instructions: [
      'Run in place while driving knees up to hip height.',
      'Pump arms rhythmically and stay light on your toes.',
      'Maintain an elevated tempo throughout the work interval.'
    ],
    metValue: 7.5,
    defaultSets: 4,
    defaultWorkSeconds: 45,
    defaultRestSeconds: 25
  },
  {
    name: 'Mountain Climbers',
    targetMuscle: 'cardio_full',
    equipmentRequired: 'none_home',
    difficulty: 'beginner',
    animationUrl: 'https://assets1.lottiefiles.com/packages/lf20_7x2v1x9b.json',
    instructions: [
      'Start in a push-up plank with shoulders over wrists.',
      'Drive one knee towards your chest, then rapidly switch legs.',
      'Keep hips level and abdominal wall tight.'
    ],
    metValue: 7.0,
    defaultSets: 4,
    defaultWorkSeconds: 40,
    defaultRestSeconds: 25
  },

  // --- DUMBBELLS (14 Exercises) ---
  {
    name: 'Flat Dumbbell Bench Press',
    targetMuscle: 'chest',
    equipmentRequired: 'dumbbells',
    difficulty: 'intermediate',
    animationUrl: 'https://assets9.lottiefiles.com/packages/lf20_f1cFsO.json',
    instructions: [
      'Lie flat on bench holding dumbbells directly over chest.',
      'Lower weights with control until upper arms break 90 degrees.',
      'Press back up without clanking dumbbells together.'
    ],
    metValue: 5.0,
    defaultSets: 3,
    defaultWorkSeconds: 45,
    defaultRestSeconds: 45
  },
  {
    name: 'Dumbbell Floor Press',
    targetMuscle: 'chest',
    equipmentRequired: 'dumbbells',
    difficulty: 'beginner',
    animationUrl: 'https://assets9.lottiefiles.com/packages/lf20_f1cFsO.json',
    instructions: [
      'Lie flat on the floor with knees bent, holding dumbbells at chest.',
      'Lower until triceps rest gently on the floor.',
      'Press up powerfully focusing on chest squeeze.'
    ],
    metValue: 4.5,
    defaultSets: 3,
    defaultWorkSeconds: 45,
    defaultRestSeconds: 40
  },
  {
    name: 'Bent-Over Dumbbell Rows',
    targetMuscle: 'back',
    equipmentRequired: 'dumbbells',
    difficulty: 'intermediate',
    animationUrl: 'https://assets5.lottiefiles.com/packages/lf20_9x8kvf7d.json',
    instructions: [
      'Hinge at hips with flat back at 45 degrees, holding dumbbells.',
      'Pull elbows back toward your ribs, squeezing mid-back.',
      'Lower with control to full extension.'
    ],
    metValue: 5.2,
    defaultSets: 3,
    defaultWorkSeconds: 45,
    defaultRestSeconds: 45
  },
  {
    name: 'Single-Arm Dumbbell Row',
    targetMuscle: 'back',
    equipmentRequired: 'dumbbells',
    difficulty: 'beginner',
    animationUrl: 'https://assets5.lottiefiles.com/packages/lf20_9x8kvf7d.json',
    instructions: [
      'Support knee and hand on a bench with flat back.',
      'Row dumbbell up toward your hip crease.',
      'Lower slowly to stretch the lat.'
    ],
    metValue: 4.8,
    defaultSets: 3,
    defaultWorkSeconds: 40,
    defaultRestSeconds: 30
  },
  {
    name: 'Dumbbell Goblet Squats',
    targetMuscle: 'legs',
    equipmentRequired: 'dumbbells',
    difficulty: 'beginner',
    animationUrl: 'https://assets2.lottiefiles.com/packages/lf20_cq0ugcsd.json',
    instructions: [
      'Hold a dumbbell vertically against your sternum with both hands.',
      'Squat down between knees while keeping torso upright.',
      'Drive through your heels to return to standing.'
    ],
    metValue: 5.5,
    defaultSets: 3,
    defaultWorkSeconds: 45,
    defaultRestSeconds: 45
  },
  {
    name: 'Dumbbell Romanian Deadlift',
    targetMuscle: 'legs',
    equipmentRequired: 'dumbbells',
    difficulty: 'intermediate',
    animationUrl: 'https://assets2.lottiefiles.com/packages/lf20_cq0ugcsd.json',
    instructions: [
      'Hold dumbbells in front of thighs with slight knee bend.',
      'Hinge hips backwards keeping weights close to shins until hamstrings stretch.',
      'Contract glutes to pull hips forward to lockout.'
    ],
    metValue: 5.2,
    defaultSets: 3,
    defaultWorkSeconds: 45,
    defaultRestSeconds: 45
  },
  {
    name: 'Standing Dumbbell Overhead Press',
    targetMuscle: 'shoulders',
    equipmentRequired: 'dumbbells',
    difficulty: 'intermediate',
    animationUrl: 'https://assets6.lottiefiles.com/packages/lf20_k9w2x9lb.json',
    instructions: [
      'Hold dumbbells at shoulder height with neutral or forward grip.',
      'Brace core and press weights directly overhead until arms lock out.',
      'Lower under control back to shoulders.'
    ],
    metValue: 5.0,
    defaultSets: 3,
    defaultWorkSeconds: 45,
    defaultRestSeconds: 45
  },
  {
    name: 'Dumbbell Lateral Raises',
    targetMuscle: 'shoulders',
    equipmentRequired: 'dumbbells',
    difficulty: 'beginner',
    animationUrl: 'https://assets6.lottiefiles.com/packages/lf20_k9w2x9lb.json',
    instructions: [
      'Stand holding dumbbells at your sides with slight elbow bend.',
      'Raise arms out to sides until parallel with the floor.',
      'Lower slowly, resisting gravity.'
    ],
    metValue: 4.2,
    defaultSets: 3,
    defaultWorkSeconds: 40,
    defaultRestSeconds: 30
  },
  {
    name: 'Alternating Dumbbell Bicep Curls',
    targetMuscle: 'arms',
    equipmentRequired: 'dumbbells',
    difficulty: 'beginner',
    animationUrl: 'https://assets3.lottiefiles.com/packages/lf20_bkm2kflj.json',
    instructions: [
      'Stand tall holding dumbbells at your sides with palms facing forward.',
      'Keep elbows pinned to your torso and curl weights up toward your shoulders.',
      'Lower slowly to maximize tension.'
    ],
    metValue: 4.5,
    defaultSets: 3,
    defaultWorkSeconds: 45,
    defaultRestSeconds: 30
  },
  {
    name: 'Dumbbell Overhead Tricep Extension',
    targetMuscle: 'arms',
    equipmentRequired: 'dumbbells',
    difficulty: 'intermediate',
    animationUrl: 'https://assets3.lottiefiles.com/packages/lf20_bkm2kflj.json',
    instructions: [
      'Grip dumbbell with both hands overhead with arms straight.',
      'Lower weight behind head by bending elbows while keeping upper arms vertical.',
      'Extend elbows back to starting position.'
    ],
    metValue: 4.2,
    defaultSets: 3,
    defaultWorkSeconds: 40,
    defaultRestSeconds: 30
  },
  {
    name: 'Hammer Curls with Dumbbells',
    targetMuscle: 'arms',
    equipmentRequired: 'dumbbells',
    difficulty: 'beginner',
    animationUrl: 'https://assets3.lottiefiles.com/packages/lf20_bkm2kflj.json',
    instructions: [
      'Hold dumbbells with palms facing each other (neutral grip).',
      'Curl weights upward targeting brachialis and forearms.',
      'Lower with control.'
    ],
    metValue: 4.2,
    defaultSets: 3,
    defaultWorkSeconds: 40,
    defaultRestSeconds: 30
  },
  {
    name: 'Dumbbell Russian Twists',
    targetMuscle: 'core',
    equipmentRequired: 'dumbbells',
    difficulty: 'intermediate',
    animationUrl: 'https://assets4.lottiefiles.com/packages/lf20_m4j30v5p.json',
    instructions: [
      'Sit on floor holding dumbbell with both hands, feet elevated.',
      'Rotate torso side to side, tapping weight gently on each side.',
      'Maintain strong abdominal hollow body hold.'
    ],
    metValue: 4.8,
    defaultSets: 3,
    defaultWorkSeconds: 40,
    defaultRestSeconds: 30
  },
  {
    name: 'Dumbbell Thrusters (Squat to Press)',
    targetMuscle: 'cardio_full',
    equipmentRequired: 'dumbbells',
    difficulty: 'advanced',
    animationUrl: 'https://assets1.lottiefiles.com/packages/lf20_7x2v1x9b.json',
    instructions: [
      'Hold dumbbells at shoulders, squat down to parallel.',
      'Explode out of squat and drive dumbbells overhead in one fluid motion.',
      'Lower weights to shoulders as you descend into next rep.'
    ],
    metValue: 8.0,
    defaultSets: 4,
    defaultWorkSeconds: 40,
    defaultRestSeconds: 40
  },
  {
    name: 'Single-Arm Dumbbell Snatches',
    targetMuscle: 'cardio_full',
    equipmentRequired: 'dumbbells',
    difficulty: 'advanced',
    animationUrl: 'https://assets1.lottiefiles.com/packages/lf20_7x2v1x9b.json',
    instructions: [
      'Place dumbbell between feet on floor.',
      'Hinge hips and explode upward, pulling dumbbell overhead in one crisp motion.',
      'Lockout arm overhead, lower and alternate.'
    ],
    metValue: 8.5,
    defaultSets: 3,
    defaultWorkSeconds: 40,
    defaultRestSeconds: 40
  },

  // --- RESISTANCE BANDS (12 Exercises) ---
  {
    name: 'Banded Chest Press',
    targetMuscle: 'chest',
    equipmentRequired: 'resistance_bands',
    difficulty: 'beginner',
    animationUrl: 'https://assets9.lottiefiles.com/packages/lf20_f1cFsO.json',
    instructions: [
      'Anchor band behind back across shoulder blades.',
      'Press handles forward until arms are fully extended.',
      'Control the eccentric return against band tension.'
    ],
    metValue: 4.0,
    defaultSets: 3,
    defaultWorkSeconds: 45,
    defaultRestSeconds: 30
  },
  {
    name: 'Banded Standing Chest Fly',
    targetMuscle: 'chest',
    equipmentRequired: 'resistance_bands',
    difficulty: 'intermediate',
    animationUrl: 'https://assets9.lottiefiles.com/packages/lf20_f1cFsO.json',
    instructions: [
      'Anchor band behind you at chest level.',
      'Bring hands together in front in a hugging arc.',
      'Squeeze chest at peak contraction.'
    ],
    metValue: 4.2,
    defaultSets: 3,
    defaultWorkSeconds: 40,
    defaultRestSeconds: 30
  },
  {
    name: 'Banded Pull-Aparts',
    targetMuscle: 'back',
    equipmentRequired: 'resistance_bands',
    difficulty: 'beginner',
    animationUrl: 'https://assets5.lottiefiles.com/packages/lf20_9x8kvf7d.json',
    instructions: [
      'Hold band with both hands at shoulder height with arms straight.',
      'Pull hands outward to sides until band touches chest.',
      'Squeeze rear delts and rhomboids.'
    ],
    metValue: 3.8,
    defaultSets: 3,
    defaultWorkSeconds: 45,
    defaultRestSeconds: 25
  },
  {
    name: 'Banded Seated Row',
    targetMuscle: 'back',
    equipmentRequired: 'resistance_bands',
    difficulty: 'beginner',
    animationUrl: 'https://assets5.lottiefiles.com/packages/lf20_9x8kvf7d.json',
    instructions: [
      'Sit on floor with legs extended, loop band around soles of feet.',
      'Pull handles back toward ribcage, pinching shoulder blades.',
      'Return slowly.'
    ],
    metValue: 4.2,
    defaultSets: 3,
    defaultWorkSeconds: 45,
    defaultRestSeconds: 30
  },
  {
    name: 'Banded Squats',
    targetMuscle: 'legs',
    equipmentRequired: 'resistance_bands',
    difficulty: 'beginner',
    animationUrl: 'https://assets2.lottiefiles.com/packages/lf20_cq0ugcsd.json',
    instructions: [
      'Stand on center of band with feet shoulder-width apart, hold handles at shoulders.',
      'Perform squats against the ascending elastic tension.',
      'Lockout hips at top.'
    ],
    metValue: 4.5,
    defaultSets: 3,
    defaultWorkSeconds: 45,
    defaultRestSeconds: 35
  },
  {
    name: 'Banded Lateral Monster Walks',
    targetMuscle: 'legs',
    equipmentRequired: 'resistance_bands',
    difficulty: 'beginner',
    animationUrl: 'https://assets2.lottiefiles.com/packages/lf20_cq0ugcsd.json',
    instructions: [
      'Place loop band around ankles or just above knees.',
      'Lower into a quarter squat and step laterally against resistance.',
      'Keep constant tension on the gluteus medius.'
    ],
    metValue: 4.2,
    defaultSets: 3,
    defaultWorkSeconds: 45,
    defaultRestSeconds: 25
  },
  {
    name: 'Banded Overhead Shoulder Press',
    targetMuscle: 'shoulders',
    equipmentRequired: 'resistance_bands',
    difficulty: 'intermediate',
    animationUrl: 'https://assets6.lottiefiles.com/packages/lf20_k9w2x9lb.json',
    instructions: [
      'Stand on band, bring handles to shoulders.',
      'Press straight overhead against resistance.',
      'Lower carefully.'
    ],
    metValue: 4.5,
    defaultSets: 3,
    defaultWorkSeconds: 40,
    defaultRestSeconds: 30
  },
  {
    name: 'Banded Lateral Shoulder Raises',
    targetMuscle: 'shoulders',
    equipmentRequired: 'resistance_bands',
    difficulty: 'beginner',
    animationUrl: 'https://assets6.lottiefiles.com/packages/lf20_k9w2x9lb.json',
    instructions: [
      'Step on band with one foot, raise handle out to side to shoulder height.',
      'Squeeze lateral head of deltoid.',
      'Lower under control.'
    ],
    metValue: 3.8,
    defaultSets: 3,
    defaultWorkSeconds: 40,
    defaultRestSeconds: 25
  },
  {
    name: 'Banded Standing Bicep Curls',
    targetMuscle: 'arms',
    equipmentRequired: 'resistance_bands',
    difficulty: 'beginner',
    animationUrl: 'https://assets3.lottiefiles.com/packages/lf20_bkm2kflj.json',
    instructions: [
      'Stand on band, curl handles toward shoulders.',
      'Maintain peak tension at top of contraction.',
      'Lower slowly.'
    ],
    metValue: 4.0,
    defaultSets: 3,
    defaultWorkSeconds: 45,
    defaultRestSeconds: 25
  },
  {
    name: 'Banded Overhead Tricep Pushaway',
    targetMuscle: 'arms',
    equipmentRequired: 'resistance_bands',
    difficulty: 'intermediate',
    animationUrl: 'https://assets3.lottiefiles.com/packages/lf20_bkm2kflj.json',
    instructions: [
      'Anchor band high behind you, step forward into lunge.',
      'Extend arms overhead against resistance targeting triceps.',
      'Bend elbows to reset.'
    ],
    metValue: 4.0,
    defaultSets: 3,
    defaultWorkSeconds: 40,
    defaultRestSeconds: 25
  },
  {
    name: 'Banded Pallof Isometric Core Press',
    targetMuscle: 'core',
    equipmentRequired: 'resistance_bands',
    difficulty: 'intermediate',
    animationUrl: 'https://assets4.lottiefiles.com/packages/lf20_m4j30v5p.json',
    instructions: [
      'Anchor band at chest height to your side.',
      'Hold handle at chest, step away to create tension, press straight out.',
      'Resist rotational twist with obliques.'
    ],
    metValue: 4.2,
    defaultSets: 3,
    defaultWorkSeconds: 40,
    defaultRestSeconds: 25
  },
  {
    name: 'Banded High Knee Cardio Drives',
    targetMuscle: 'cardio_full',
    equipmentRequired: 'resistance_bands',
    difficulty: 'advanced',
    animationUrl: 'https://assets1.lottiefiles.com/packages/lf20_7x2v1x9b.json',
    instructions: [
      'Loop band around hips and anchor behind you.',
      'Sprint forward driving knees high against elastic pull.',
      'Maintain maximum effort.'
    ],
    metValue: 7.8,
    defaultSets: 4,
    defaultWorkSeconds: 35,
    defaultRestSeconds: 30
  },

  // --- FULL GYM (12 Exercises) ---
  {
    name: 'Barbell Flat Bench Press',
    targetMuscle: 'chest',
    equipmentRequired: 'full_gym',
    difficulty: 'intermediate',
    animationUrl: 'https://assets9.lottiefiles.com/packages/lf20_f1cFsO.json',
    instructions: [
      'Lie on bench, grip barbell slightly wider than shoulders.',
      'Unrack, lower bar to mid-chest with elbows tucked 45 degrees.',
      'Press upward to full lockout.'
    ],
    metValue: 5.5,
    defaultSets: 3,
    defaultWorkSeconds: 45,
    defaultRestSeconds: 60
  },
  {
    name: 'Incline Barbell Bench Press',
    targetMuscle: 'chest',
    equipmentRequired: 'full_gym',
    difficulty: 'advanced',
    animationUrl: 'https://assets9.lottiefiles.com/packages/lf20_f1cFsO.json',
    instructions: [
      'Set bench to 30-degree incline.',
      'Lower bar with control to upper chest.',
      'Press upward focusing on upper chest fiber recruitment.'
    ],
    metValue: 5.8,
    defaultSets: 3,
    defaultWorkSeconds: 45,
    defaultRestSeconds: 60
  },
  {
    name: 'Barbell Bent-Over Row',
    targetMuscle: 'back',
    equipmentRequired: 'full_gym',
    difficulty: 'intermediate',
    animationUrl: 'https://assets5.lottiefiles.com/packages/lf20_9x8kvf7d.json',
    instructions: [
      'Hinge hips with torso at 45 degrees, grip bar overhand.',
      'Pull bar to lower sternum, squeezing lats and middle trapezius.',
      'Lower to hang without rounding lower back.'
    ],
    metValue: 6.0,
    defaultSets: 3,
    defaultWorkSeconds: 45,
    defaultRestSeconds: 60
  },
  {
    name: 'Lat Pulldown Machine Cable',
    targetMuscle: 'back',
    equipmentRequired: 'full_gym',
    difficulty: 'beginner',
    animationUrl: 'https://assets5.lottiefiles.com/packages/lf20_9x8kvf7d.json',
    instructions: [
      'Sit facing machine with thighs secured under pads.',
      'Grip wide bar, pull down to upper chest while depressing shoulder blades.',
      'Control the ascent.'
    ],
    metValue: 5.0,
    defaultSets: 3,
    defaultWorkSeconds: 45,
    defaultRestSeconds: 45
  },
  {
    name: 'Barbell Back Squats',
    targetMuscle: 'legs',
    equipmentRequired: 'full_gym',
    difficulty: 'intermediate',
    animationUrl: 'https://assets2.lottiefiles.com/packages/lf20_cq0ugcsd.json',
    instructions: [
      'Rest barbell securely across upper trapezius in squat rack.',
      'Descend by breaking at hips and knees until thighs pass parallel.',
      'Drive powerfully up through the midfoot.'
    ],
    metValue: 6.5,
    defaultSets: 4,
    defaultWorkSeconds: 45,
    defaultRestSeconds: 60
  },
  {
    name: 'Leg Press Machine Press',
    targetMuscle: 'legs',
    equipmentRequired: 'full_gym',
    difficulty: 'beginner',
    animationUrl: 'https://assets2.lottiefiles.com/packages/lf20_cq0ugcsd.json',
    instructions: [
      'Sit in 45-degree sled machine with feet hip-width on platform.',
      'Release safety handles, lower weight until knees bend 90 degrees.',
      'Press platform upward without hyperextending knees.'
    ],
    metValue: 5.5,
    defaultSets: 3,
    defaultWorkSeconds: 45,
    defaultRestSeconds: 45
  },
  {
    name: 'Seated Overhead Barbell Press',
    targetMuscle: 'shoulders',
    equipmentRequired: 'full_gym',
    difficulty: 'intermediate',
    animationUrl: 'https://assets6.lottiefiles.com/packages/lf20_k9w2x9lb.json',
    instructions: [
      'Sit on upright bench with bar across front deltoids.',
      'Press bar vertically overhead until locked out.',
      'Lower bar to chin level with control.'
    ],
    metValue: 5.5,
    defaultSets: 3,
    defaultWorkSeconds: 45,
    defaultRestSeconds: 60
  },
  {
    name: 'Cable Lateral Deltoid Raise',
    targetMuscle: 'shoulders',
    equipmentRequired: 'full_gym',
    difficulty: 'beginner',
    animationUrl: 'https://assets6.lottiefiles.com/packages/lf20_k9w2x9lb.json',
    instructions: [
      'Set low cable pulley, hold handle across body.',
      'Raise arm out to the side until parallel to the floor.',
      'Resist weight stack on return.'
    ],
    metValue: 4.5,
    defaultSets: 3,
    defaultWorkSeconds: 40,
    defaultRestSeconds: 30
  },
  {
    name: 'Cable Tricep Rope Pushdown',
    targetMuscle: 'arms',
    equipmentRequired: 'full_gym',
    difficulty: 'beginner',
    animationUrl: 'https://assets3.lottiefiles.com/packages/lf20_bkm2kflj.json',
    instructions: [
      'Attach rope to high pulley, pin elbows by your ribs.',
      'Extend arms downward, spreading rope ends apart at bottom.',
      'Squeeze triceps for 1 second.'
    ],
    metValue: 4.5,
    defaultSets: 3,
    defaultWorkSeconds: 45,
    defaultRestSeconds: 30
  },
  {
    name: 'Barbell Preacher Curls',
    targetMuscle: 'arms',
    equipmentRequired: 'full_gym',
    difficulty: 'intermediate',
    animationUrl: 'https://assets3.lottiefiles.com/packages/lf20_bkm2kflj.json',
    instructions: [
      'Sit at preacher bench with armpits snug against pad.',
      'Curl EZ-bar upward toward chin.',
      'Lower bar slowly until arms are near full extension.'
    ],
    metValue: 4.8,
    defaultSets: 3,
    defaultWorkSeconds: 40,
    defaultRestSeconds: 35
  },
  {
    name: 'Hanging Abdominal Knee Raises',
    targetMuscle: 'core',
    equipmentRequired: 'full_gym',
    difficulty: 'intermediate',
    animationUrl: 'https://assets4.lottiefiles.com/packages/lf20_m4j30v5p.json',
    instructions: [
      'Hang from pull-up bar with overhand grip.',
      'Contract abs and curl knees upward toward chest.',
      'Lower legs slowly without swinging.'
    ],
    metValue: 5.0,
    defaultSets: 3,
    defaultWorkSeconds: 40,
    defaultRestSeconds: 30
  },
  {
    name: 'Rowing Machine High Intensity Intervals',
    targetMuscle: 'cardio_full',
    equipmentRequired: 'full_gym',
    difficulty: 'advanced',
    animationUrl: 'https://assets1.lottiefiles.com/packages/lf20_7x2v1x9b.json',
    instructions: [
      'Strap feet in, grip handle with overhand grip.',
      'Drive with legs, lean back slightly, pull handle into lower ribs.',
      'Sprint at max wattage for the duration of interval.'
    ],
    metValue: 9.0,
    defaultSets: 4,
    defaultWorkSeconds: 40,
    defaultRestSeconds: 40
  }
];

console.log('Total exercises compiled:', exercises.length);
fs.writeFileSync('server/src/seed/exercisesData.json', JSON.stringify(exercises, null, 2));


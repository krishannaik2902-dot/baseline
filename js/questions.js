/*
 * The assessment question bank. JSON-pure: no functions, validated by
 * engine.validateData() in tests.
 *
 * Voice rules: plain, dry, human. No exclamation marks, no shame, no
 * wellness-speak. "Prefer not to say" is always allowed on anything personal.
 * Intake questions (age, sex, meds, conditions) carry weight 0 and no scores —
 * they steer the plan and raise flags, they don't judge you.
 */

'use strict';

const QUESTIONS = [
  /* ------------------------------------------------ intake (unscored) */
  {
    id: 'age_band', domain: 'body', weight: 0, type: 'choice',
    text: 'How old are you?',
    options: [
      { value: 'u18', label: 'Under 18', flags: ['under18'] },
      { value: '18_24', label: '18–24' },
      { value: '25_34', label: '25–34' },
      { value: '35_44', label: '35–44' },
      { value: '45_54', label: '45–54' },
      { value: '55_64', label: '55–64' },
      { value: '65p', label: '65+' },
    ],
  },
  {
    id: 'sex', domain: 'body', weight: 0, type: 'choice',
    text: 'Sex at birth?',
    help: 'Only used to tailor a few recommendations (iron, creatine dosing, pregnancy check). Skip it if you like.',
    options: [
      { value: 'female', label: 'Female' },
      { value: 'male', label: 'Male' },
      { value: 'skip', label: 'Prefer not to say' },
    ],
  },
  {
    id: 'pregnant', domain: 'body', weight: 0, type: 'choice',
    text: 'Pregnant or breastfeeding?',
    showIf: { q: 'sex', in: ['female'] },
    options: [
      { value: 'yes', label: 'Yes', flags: ['pregnant'] },
      { value: 'no', label: 'No' },
      { value: 'skip', label: 'Prefer not to say', flags: ['pregnant'] },
    ],
    help: 'If you’d rather not say, we’ll play it safe and leave supplements and fasting out of your plan.',
  },
  {
    id: 'meds', domain: 'body', weight: 0, type: 'choice',
    text: 'Do you take prescription medication regularly?',
    options: [
      { value: 'yes', label: 'Yes', flags: ['meds'] },
      { value: 'no', label: 'No' },
      { value: 'skip', label: 'Prefer not to say', flags: ['meds'] },
    ],
  },
  {
    id: 'heart', domain: 'body', weight: 0, type: 'choice',
    text: 'Any diagnosed heart condition — or chest pain, pressure, or unusual breathlessness when you exert yourself?',
    options: [
      { value: 'yes', label: 'Yes', flags: ['heart_symptoms'] },
      { value: 'no', label: 'No' },
      { value: 'unsure', label: 'Not sure', flags: ['heart_symptoms'] },
    ],
  },
  {
    id: 'weight_self', domain: 'body', weight: 2, type: 'choice',
    text: 'Your weight, honestly:',
    help: 'Self-reported is fine. We’re not going to make you stand on anything.',
    options: [
      { value: 'under', label: 'Probably underweight', score: 55 },
      { value: 'about_right', label: 'About right', score: 90 },
      { value: 'bit_over', label: 'A bit over where I’d like', score: 60 },
      { value: 'well_over', label: 'Well over where I’d like', score: 35 },
      { value: 'skip', label: 'Prefer not to say' },
    ],
  },

  /* --------------------------------------------------------- sleep */
  {
    id: 'sleep_hours', domain: 'sleep', weight: 3, type: 'choice',
    text: 'On a typical night, how much do you actually sleep?',
    help: 'Not time in bed. Time asleep.',
    options: [
      { value: 'lt5', label: 'Under 5 hours', score: 10, flags: ['severe_sleep'] },
      { value: '5_6', label: '5–6 hours', score: 35 },
      { value: '6_7', label: '6–7 hours', score: 65 },
      { value: '7_8', label: '7–8 hours', score: 95 },
      { value: '8_9', label: '8–9 hours', score: 90 },
      { value: '9p', label: 'More than 9', score: 60 },
    ],
  },
  {
    id: 'sleep_consistency', domain: 'sleep', weight: 2, type: 'choice',
    text: 'Do you go to bed at roughly the same time each night?',
    options: [
      { value: 'same', label: 'Within about half an hour, most nights', score: 95 },
      { value: 'hourish', label: 'It drifts by an hour or two', score: 55 },
      { value: 'chaos', label: 'All over the place (or I do shift work)', score: 25 },
    ],
  },
  {
    id: 'wake_refreshed', domain: 'sleep', weight: 2, type: 'choice',
    text: 'How do you feel when you wake up?',
    options: [
      { value: 'fresh', label: 'Mostly rested', score: 90 },
      { value: 'mixed', label: 'Depends on the day', score: 55 },
      { value: 'rough', label: 'Rarely rested, whatever I do', score: 25 },
    ],
  },
  {
    id: 'snoring', domain: 'sleep', weight: 1, type: 'choice',
    text: 'Has anyone said you snore loudly or seem to stop breathing at night — or do you nod off during the day?',
    options: [
      { value: 'yes', label: 'Yes', score: 15, flags: ['severe_sleep'] },
      { value: 'sometimes', label: 'Occasionally / not sure', score: 50 },
      { value: 'no', label: 'No', score: 85 },
    ],
  },
  {
    id: 'phone_bed', domain: 'sleep', weight: 1, type: 'choice',
    text: 'Where does your phone sleep?',
    options: [
      { value: 'in_bed', label: 'In my hand until I pass out', score: 25 },
      { value: 'nearby', label: 'Bedside table', score: 60 },
      { value: 'away', label: 'Another room, or out of reach', score: 90 },
    ],
  },

  /* ------------------------------------------------------ movement */
  {
    id: 'strength_days', domain: 'movement', weight: 3, type: 'number',
    text: 'Days per week you do strength work?',
    help: 'Weights, bodyweight, resistance bands — anything where muscles work against load.',
    min: 0, max: 7, unit: 'days',
    bands: [
      { max: 0, score: 20 },
      { max: 1, score: 55 },
      { max: 2, score: 80 },
      { max: 4, score: 95 },
      { max: 7, score: 85 },
    ],
  },
  {
    id: 'cardio_days', domain: 'movement', weight: 3, type: 'number',
    text: 'Days per week you get properly out of breath?',
    help: 'Brisk walk uphill counts. Strolling to the fridge does not.',
    min: 0, max: 7, unit: 'days',
    bands: [
      { max: 0, score: 15 },
      { max: 1, score: 45 },
      { max: 2, score: 65 },
      { max: 4, score: 90 },
      { max: 7, score: 95 },
    ],
  },
  {
    id: 'sitting_hours', domain: 'movement', weight: 2, type: 'number',
    text: 'Hours a day you spend sitting?',
    help: 'Desk + car + sofa. Be honest, we’ve all done the maths and winced.',
    min: 0, max: 18, unit: 'hours',
    bands: [
      { max: 4, score: 90 },
      { max: 6, score: 75 },
      { max: 8, score: 55 },
      { max: 10, score: 35 },
      { max: 18, score: 20 },
    ],
  },
  {
    id: 'stairs', domain: 'movement', weight: 2, type: 'choice',
    text: 'Three flights of stairs leave you:',
    options: [
      { value: 'fine', label: 'Fine — could chat the whole way', score: 90 },
      { value: 'puffed', label: 'A bit puffed at the top', score: 60 },
      { value: 'winded', label: 'Properly winded', score: 25 },
    ],
  },

  /* ----------------------------------------------------- nutrition */
  {
    id: 'diet_pattern', domain: 'nutrition', weight: 3, type: 'choice',
    text: 'Most of what you eat is:',
    options: [
      { value: 'whole', label: 'Cooked from actual ingredients', score: 90 },
      { value: 'mixed', label: 'A real mix of home-cooked and packaged', score: 60 },
      { value: 'processed', label: 'Mostly packaged, delivery, or beige', score: 25 },
    ],
  },
  {
    id: 'protein_meals', domain: 'nutrition', weight: 2, type: 'choice',
    text: 'Does protein show up at most of your meals?',
    help: 'Meat, fish, eggs, dairy, tofu, beans, lentils.',
    options: [
      { value: 'most', label: 'Most meals', score: 90 },
      { value: 'some', label: 'Some meals', score: 60 },
      { value: 'rarely', label: 'I’ve never really thought about it', score: 35 },
    ],
  },
  {
    id: 'veg_servings', domain: 'nutrition', weight: 2, type: 'number',
    text: 'Servings of vegetables or fruit on a normal day?',
    help: 'A serving is roughly a fist-sized amount. Chips are a vegetable in spirit only.',
    min: 0, max: 10, unit: 'servings',
    bands: [
      { max: 0, score: 15 },
      { max: 1, score: 35 },
      { max: 2, score: 55 },
      { max: 3, score: 75 },
      { max: 10, score: 95 },
    ],
  },
  {
    id: 'food_relationship', domain: 'nutrition', weight: 1, type: 'choice',
    text: 'Your relationship with food is:',
    options: [
      { value: 'easy', label: 'Pretty relaxed', score: 85 },
      { value: 'complicated', label: 'Complicated', score: 45 },
      { value: 'ed_history', label: 'I’ve had disordered eating in the past', score: 45, flags: ['eating_disorder_history'] },
      { value: 'skip', label: 'Prefer not to say' },
    ],
  },

  /* ---------------------------------------------------------- mind */
  {
    id: 'stress', domain: 'mind', weight: 3, type: 'choice',
    text: 'How often does stress run the day?',
    options: [
      { value: 'rare', label: 'Rarely — busy but on top of it', score: 90 },
      { value: 'weeks', label: 'Some weeks are bad', score: 60 },
      { value: 'most', label: 'Most days, honestly', score: 30 },
    ],
  },
  {
    id: 'downshift', domain: 'mind', weight: 1, type: 'choice',
    text: 'Do you have a reliable way to switch off?',
    help: 'Anything that works: walking, praying, cooking, lifting, staring at the sea.',
    options: [
      { value: 'yes', label: 'Yes, and I actually use it', score: 90 },
      { value: 'kinda', label: 'Sort of, when I remember', score: 55 },
      { value: 'no', label: 'Not really — I just keep going', score: 25 },
    ],
  },
  {
    id: 'mood', domain: 'mind', weight: 2, type: 'choice',
    text: 'The past two weeks, your mood has mostly been:',
    options: [
      { value: 'good', label: 'Good', score: 90 },
      { value: 'updown', label: 'Up and down', score: 55 },
      { value: 'low', label: 'Low more days than not', score: 25 },
      { value: 'heavy', label: 'Low, and I’ve lost interest in most things', score: 10, flags: ['low_mood_severe'] },
    ],
  },

  /* ---------------------------------------------------- connection */
  {
    id: 'two_am', domain: 'connection', weight: 2, type: 'choice',
    text: 'People you could call at 2am with a real problem:',
    options: [
      { value: 'three_plus', label: 'Three or more', score: 95 },
      { value: 'one_two', label: 'One or two', score: 70 },
      { value: 'none', label: 'Right now, honestly, none', score: 20 },
    ],
  },
  {
    id: 'purpose', domain: 'connection', weight: 2, type: 'choice',
    text: 'Is there something in your life you’re building or genuinely looking forward to?',
    options: [
      { value: 'yes', label: 'Yes', score: 90 },
      { value: 'sometimes', label: 'In patches', score: 60 },
      { value: 'no', label: 'Not at the moment', score: 30 },
    ],
  },

  /* ---------------------------------------------------- substances */
  {
    id: 'smoking', domain: 'substances', weight: 3, type: 'choice',
    text: 'Smoking or vaping?',
    options: [
      { value: 'never', label: 'Never', score: 95 },
      { value: 'quit', label: 'Quit', score: 85 },
      { value: 'social', label: 'Socially / occasionally', score: 35 },
      { value: 'daily', label: 'Daily', score: 10 },
    ],
  },
  {
    id: 'alcohol_week', domain: 'substances', weight: 2, type: 'number',
    text: 'Drinks in a typical week?',
    help: 'One drink = a beer, a glass of wine, a shot. A “heavy pour” counts as two and you know it.',
    min: 0, max: 50, unit: 'drinks',
    bands: [
      { max: 0, score: 95 },
      { max: 3, score: 85 },
      { max: 7, score: 65 },
      { max: 14, score: 35 },
      { max: 50, score: 15 },
    ],
  },
  {
    id: 'caffeine_late', domain: 'substances', weight: 1, type: 'choice',
    text: 'Caffeine after 2pm?',
    options: [
      { value: 'never', label: 'Rarely or never', score: 90 },
      { value: 'sometimes', label: 'Sometimes', score: 60 },
      { value: 'daily', label: 'Most days', score: 35 },
    ],
  },

  /* -------------------------------------------------------- habits */
  {
    id: 'morning_light', domain: 'habits', weight: 2, type: 'choice',
    text: 'Are you outside in daylight within an hour of waking?',
    help: 'Through a window doesn’t count, annoyingly.',
    options: [
      { value: 'most', label: 'Most days', score: 90 },
      { value: 'sometimes', label: 'Sometimes', score: 55 },
      { value: 'rarely', label: 'Rarely — I wake up indoors and stay there', score: 25 },
    ],
  },
  {
    id: 'last_meal', domain: 'habits', weight: 1, type: 'choice',
    text: 'Your last food of the day is usually:',
    options: [
      { value: 'early', label: 'Two or three hours before bed', score: 90 },
      { value: 'varies', label: 'It varies', score: 60 },
      { value: 'late', label: 'Within an hour of sleep (or in bed)', score: 40 },
    ],
  },
  {
    id: 'outside_time', domain: 'habits', weight: 1, type: 'choice',
    text: 'Time outdoors on a normal day?',
    options: [
      { value: 'hour_plus', label: 'An hour or more', score: 90 },
      { value: 'bits', label: 'Twenty minutes, in bits', score: 60 },
      { value: 'none', label: 'Door to car to desk to sofa', score: 25 },
    ],
  },
];

if (typeof module !== 'undefined') module.exports = { QUESTIONS };

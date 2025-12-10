import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  bookSidebar: [
    'intro', // The intro page

    {
      type: 'category',
      label: 'Part 1: Foundations of Physical AI & Humanoid Robotics',
      items: [
        'part1/part1_chapter1',
        'part1/part1_chapter2',
        'part1/part1_chapter3',
        'part1/part1_chapter4',
        'part1/part1_chapter5',
        'part1/part1_chapter6',
        'part1/part1_chapter7',
        'part1/part1_chapter8',
      ],
    },
    {
      type: 'category',
      label: 'Part 2: Kinematics of Humanoid Robots',
      items: [
        'part2/part2_chapter1',
        'part2/part2_chapter2',
        'part2/part2_chapter3',
        'part2/part2_chapter4',
        'part2/part2_chapter5',
        'part2/part2_chapter6',
        'part2/part2_chapter7',
        'part2/part2_chapter8',
      ],
    },
    {
      type: 'category',
      label: 'Part 3: Dynamics of Humanoid Robots',
      items: [
        'part3/part3_chapter1',
        'part3/part3_chapter2',
        'part3/part3_chapter3',
        'part3/part3_chapter4',
        'part3/part3_chapter5',
        'part3/part3_chapter6',
        'part3/part3_chapter7',
        'part3/part3_chapter8',
      ],
    },
    {
      type: 'category',
      label: 'Part 4: Motion Planning and Control',
      items: [
        'part4/part4_chapter1',
        'part4/part4_chapter2',
        'part4/part4_chapter3',
        'part4/part4_chapter4',
        'part4/part4_chapter5',
        'part4/part4_chapter6',
        'part4/part4_chapter7',
        'part4/part4_chapter8',
      ],
    },
    {
      type: 'category',
      label: 'Part 5: Perception and AI for Humanoids',
      items: [
        'part5/part5_chapter1',
        'part5/part5_chapter2',
        'part5/part5_chapter3',
        'part5/part5_chapter4',
        'part5/part5_chapter5',
        'part5/part5_chapter6',
        'part5/part5_chapter7',
        'part5/part5_chapter8',
      ],
    },
    {
      type: 'category',
      label: 'Part 6: Advanced Topics and Future Directions',
      items: [
        'part6/part6_chapter1',
        'part6/part6_chapter2',
        'part6/part6_chapter3',
        'part6/part6_chapter4',
        'part6/part6_chapter5',
        'part6/part6_chapter6',
        'part6/part6_chapter7',
        'part6/part6_chapter8',
      ],
    },
  ],
};

export default sidebars;
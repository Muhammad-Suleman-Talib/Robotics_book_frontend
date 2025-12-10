
# Define book structure and titles
$partTitles = @(
    "Foundations of Physical AI & Humanoid Robotics",
    "Kinematics of Humanoid Robots",
    "Dynamics of Humanoid Robots",
    "Motion Planning and Control",
    "Perception and AI for Humanoids",
    "Advanced Topics and Future Directions"
)

$chapterTitles = @(
    @( # Part 1
        "History and Evolution of Humanoid Robotics",
        "Key Concepts in Physical AI and Embodied Intelligence",
        "Robotic Systems Overview: Components and Architecture",
        "Ethical Considerations in Humanoid Robotics",
        "Introduction to Robot Operating System (ROS)",
        "Simulation Environments for Humanoids",
        "Degrees of Freedom and Coordinate Systems",
        "Actuators and Sensors for Humanoid Robots"
    ),
    @( # Part 2
        "Forward Kinematics: Position and Orientation",
        "Denavit-Hartenberg (D-H) Parameters",
        "Inverse Kinematics: Analytical Solutions",
        "Inverse Kinematics: Numerical Solutions",
        "Workspace Analysis and Dexterity",
        "Kinematic Singularities",
        "Jacobians for Velocity and Force Analysis",
        "Lab: Kinematic Modeling and Simulation"
    ),
    @( # Part 3
        "Lagrangian Dynamics",
        "Newton-Euler Formulation",
        "Equations of Motion for Multi-Link Robots",
        "Inverse Dynamics: Computing Joint Torques",
        "Forward Dynamics: Simulating Motion",
        "Robot Inertia and Mass Properties",
        "External Forces and Contact Dynamics",
        "Lab: Dynamic Simulation and Analysis"
    ),
    @( # Part 4
        "Trajectory Generation",
        "Joint Space vs. Task Space Control",
        "PID Control for Robot Joints",
        "Force and Impedance Control",
        "Whole-Body Control Architectures",
        "Gait Generation for Bipedal Robots",
        "Balance and Stability Control",
        "Lab: Implementing Basic Motion Control"
    ),
    @( # Part 5
        "Sensor Fusion for Environment Perception",
        "Vision Systems: Object Recognition and Tracking",
        "Lidar and Depth Sensing for Mapping",
        "AI in Robotics: Machine Learning Applications",
        "Reinforcement Learning for Robot Control",
        "Natural Language Processing for Human-Robot Interaction",
        "Human Gesture and Emotion Recognition",
        "Lab: Integrating Perception Modules"
    ),
    @( # Part 6
        "Human-Robot Collaboration",
        "Learning from Demonstration",
        "Compliant Robotics and Soft Actuators",
        "Ethical AI and Safety Protocols",
        "Swarm Robotics with Humanoids",
        "Bio-Inspired Robotics",
        "Future Challenges and Opportunities",
        "Project: Building a Simple Humanoid Application"
    )
)

$docsBaseDir = "book-site/docs"

# Generate content for each part and chapter
for ($p = 0; $p -lt $partTitles.Length; $p++) {
    $partNumber = $p + 1
    $partDir = Join-Path $docsBaseDir "part$partNumber"
    New-Item -ItemType Directory -Force -Path $partDir | Out-Null

    $currentPartChapters = $chapterTitles[$p]
    for ($c = 0; $c -lt $currentPartChapters.Length; $c++) {
        $chapterNumber = $c + 1
        $chapterTitle = $currentPartChapters[$c]
        $chapterFileName = "chapter$chapterNumber.md"
        $chapterFilePath = Join-Path $partDir $chapterFileName
        $chapterId = "part${partNumber}_chapter${chapterNumber}"
        
        $content = @"
---
id: $chapterId
sidebar_position: $($chapterNumber)
title: $($chapterTitle)
---

# $($chapterTitle)

This chapter delves into the topic of "$($chapterTitle)" within the context of "Physical AI & Humanoid Robotics". Here, we explore the fundamental concepts, key principles, and practical applications related to this area.

## Key Concepts

- Concept 1: Description
- Concept 2: Description

## Advanced Topics

Further discussion on advanced aspects.

## Exercises

1. Exercise 1.
2. Exercise 2.

## Further Reading

- [Relevant Article/Book Title](link_to_resource)
"@

        Set-Content -Path $chapterFilePath -Value $content -Encoding UTF8
        Write-Host "Generated: $chapterFilePath"
    }
}

Write-Host "All book content (parts and chapters) generated successfully."

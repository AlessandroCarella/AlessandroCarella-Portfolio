import React from "react";
import TextCapsule from "./text/TextCapsule";
import "./styles/SkillSection.css";

const SkillSection = ({
    sectionName,
    skills,
    colors,
}) => {
    const titleStyle = {
        color: colors.sectionTitle,
    };

    return (
        <div className="skill-section">
            <h3 className="heading-sm" style={titleStyle}>
                {sectionName}
            </h3>
            <div className="skills-list">
                {skills.map((skill, index) => {
                    return (
                        <TextCapsule
                            key={index}
                            name={skill}
                            colors={colors}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default SkillSection;

import * as React from 'react';
import { Stack, Label, TextField, Checkbox } from '@fluentui/react';
import { IInputs } from "../generated/ManifestTypes"; // Adjust the path based on your project structure

const labelStyle: React.CSSProperties = {
  fontWeight: 'bold',
  marginBottom: '8px',
};

const inputContainerStyle: React.CSSProperties = {
  marginBottom: '16px',
};

interface QuestionInputStackProps {
  questions: any[];
  title: string;
  context: ComponentFramework.Context<IInputs>; // Add this line to receive context data
}

export const QuestionInputStack: React.FC<QuestionInputStackProps> = ({ questions }) => (
  <Stack>
    {questions.map((question: any, index: number) => (
      <div key={index} style={inputContainerStyle}>
        <Label style={labelStyle}>{question.lfs_translationname}</Label>
        <QuestionInput dataTypeName={question["lfs_questiondatatype@OData.Community.Display.V1.FormattedValue"]} />
      </div>
    ))}
  </Stack>
);

interface QuestionInputProps {
  dataTypeName: string;
}

const QuestionInput: React.FC<QuestionInputProps> = ({ dataTypeName }) => {
  const inputStyle: React.CSSProperties = {
    width: '100%', // Adjust width as needed
  };

  switch (dataTypeName) {
    case 'Text':
      return <TextField style={inputStyle} />;
    case 'Number':
      return <TextField style={inputStyle} type="number" />;
    case 'Boolean':
      return <Checkbox />;
    case 'Date':
      return <TextField style={inputStyle} type="date" />;
    case 'Time':
      return <TextField style={inputStyle} type="time" />;
    case 'Decimal':
      return <TextField style={inputStyle} type="number" step="any" />;
    default:
      console.warn(`Unsupported data type "${dataTypeName}".`);
      return null;
  }
};
interface TextProps extends React.ComponentProps<"p"> {
  children: React.ReactNode;
}

export const Text: React.FC<TextProps> = ({ className, children }) => (
  <p className={`mb-4 leading-relaxed ${className}`}>{children}</p>
);

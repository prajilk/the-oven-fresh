import { Children, type PropsWithChildren } from 'react';

export const Show = (props: PropsWithChildren) => {
  let when: React.ReactNode | null = null;
  // biome-ignore lint/suspicious/noEvolvingTypes: <Many types>
  let otherwise = null;

  Children.forEach(props.children, (children) => {
    // @ts-expect-error: children.props.isTrue is of type boolean | undefined
    if (children?.props.isTrue === undefined) {
      otherwise = children;
      // @ts-expect-error: children.props.isTrue is of type boolean | undefined
    } else if (!when && children?.props.isTrue === true) {
      when = children;
    }
  });

  return when || otherwise;
};

Show.When = ({
  isTrue,
  children,
}: {
  isTrue: boolean;
  children: React.ReactNode;
}) => isTrue && children;
Show.Else = ({ children }: { children: React.ReactNode }) => children;

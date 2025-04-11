
import * as React from "react"
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible"

const Collapsible = CollapsiblePrimitive.Root

// Define a type for the function children
type CollapsibleTriggerFunctionChildren = (props: { open: boolean }) => React.ReactNode;

// Fix the props interface with proper typing
interface CollapsibleTriggerProps extends React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Trigger> {
  children: React.ReactNode | ((props: { open: boolean }) => React.ReactNode);
}

const CollapsibleTrigger = React.forwardRef<
  React.ElementRef<typeof CollapsiblePrimitive.Trigger>,
  CollapsibleTriggerProps
>(({ children, ...props }, ref) => {
  // Use useContext with the correct context type
  const context = React.useContext(CollapsiblePrimitive.CollapsibleContextProvider);
  const open = context ? context.open : false;

  return (
    <CollapsiblePrimitive.Trigger
      ref={ref}
      {...props}
    >
      {typeof children === 'function' 
        ? children({ open }) 
        : children}
    </CollapsiblePrimitive.Trigger>
  );
});
CollapsibleTrigger.displayName = CollapsiblePrimitive.Trigger.displayName;

const CollapsibleContent = React.forwardRef<
  React.ElementRef<typeof CollapsiblePrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <CollapsiblePrimitive.Content
    ref={ref}
    className={`data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden ${className}`}
    {...props}
  >
    {children}
  </CollapsiblePrimitive.Content>
))
CollapsibleContent.displayName = CollapsiblePrimitive.Content.displayName

export { Collapsible, CollapsibleTrigger, CollapsibleContent }


import * as React from "react"
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible"

const Collapsible = CollapsiblePrimitive.Root

// Define a simple type for the function children
type CollapsibleTriggerFunctionChildren = (props: { open: boolean }) => React.ReactNode;

// Fixed props interface with proper typing
interface CollapsibleTriggerProps extends React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Trigger> {
  children: React.ReactNode | CollapsibleTriggerFunctionChildren;
}

const CollapsibleTrigger = React.forwardRef<
  React.ElementRef<typeof CollapsiblePrimitive.Trigger>,
  CollapsibleTriggerProps
>(({ children, ...props }, ref) => {
  // Get the open state from the parent collapsible using useContext
  const contextValue = React.useContext(CollapsiblePrimitive.CollapsibleContext);
  const open = contextValue?.open || false;

  return (
    <CollapsiblePrimitive.Trigger
      ref={ref}
      {...props}
    >
      {typeof children === 'function' 
        ? (children as CollapsibleTriggerFunctionChildren)({ open }) 
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

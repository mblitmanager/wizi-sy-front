import { memo } from 'react';
import { useOptimizedNavigate, type RouteKey } from '@/router/routes';

interface NavigationLinkProps {
  to: RouteKey;
  children: React.ReactNode;
  className?: string;
  onMouseEnter?: () => void;
  onClick?: () => void;
}

export const NavigationLink = memo(({
  to,
  children,
  className = '',
  onMouseEnter,
  onClick,
}: NavigationLinkProps) => {
  const navigateTo = useOptimizedNavigate();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onClick?.();
    navigateTo(to);
  };

  return (
    <a
      href={to}
      className={className}
      onClick={handleClick}
      onMouseEnter={onMouseEnter}
    >
      {children}
    </a>
  );
});
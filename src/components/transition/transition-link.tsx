"use client";

import Link from "next/link";
import { forwardRef } from "react";
import { transitionSourceFrom, usePageTransition } from "./page-transition";

type TransitionLinkProps = React.ComponentProps<typeof Link> & { href: string };

/**
 * A Link that opens its destination with the click-to-expand transition.
 * Modified clicks (new tab, etc.) and links without a [data-transition-source]
 * image behave exactly like a normal Link.
 */
const TransitionLink = forwardRef<HTMLAnchorElement, TransitionLinkProps>(function TransitionLink(
  { href, onClick, ...props },
  ref,
) {
  const { expandTo } = usePageTransition();

  return (
    <Link
      ref={ref}
      href={href}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        const source = transitionSourceFrom(event.currentTarget);
        if (!source) return;
        event.preventDefault();
        expandTo({ href, ...source });
      }}
      {...props}
    />
  );
});

export default TransitionLink;

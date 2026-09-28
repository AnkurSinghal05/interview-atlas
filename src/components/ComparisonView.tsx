import { useState } from "react";
import { Lightbulb, Maximize2 } from "lucide-react";
import type { Comparison } from "@/content/types";
import { RichText } from "@/lib/RichText";
import { tintStyle } from "@/lib/tint";
import { useExpandOrigin } from "@/lib/useExpandOrigin";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { CodeBlock } from "./CodeBlock";

/** Each compared item keeps the same colour in the header, the "when to use" list and the code. */
const itemTint = (i: number) => tintStyle(i * 3 + 1);

const titleOf = (c: Comparison) => c.title ?? c.items.join(" vs ");

/** An "X vs Y" table with the reveal and "when to use which". Click Expand for a larger pop-up. */
export function ComparisonView({ comparison }: { comparison: Comparison }) {
  const [open, setOpen] = useState(false);
  const origin = useExpandOrigin();

  return (
    <section className="bg-card flex min-w-0 flex-col gap-4 rounded-xl border p-4 md:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-0.5">
          <p className="text-subject text-xs font-bold tracking-[0.1em] uppercase">
            Compare
          </p>
          <h3 className="text-lg font-extrabold tracking-[-0.01em] md:text-xl">
            <RichText text={titleOf(comparison)} />
          </h3>
        </div>
        <button
          type="button"
          onClick={(e) => {
            origin.from(e.currentTarget.closest("section") ?? e.currentTarget);
            setOpen(true);
          }}
          className="text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:ring-ring/50 flex flex-none items-center gap-1.5 rounded-md px-2 py-1 text-xs font-semibold outline-none focus-visible:ring-[3px]"
        >
          <Maximize2 className="size-3.5" aria-hidden="true" />
          Expand
        </button>
      </div>
      <ComparisonBody comparison={comparison} />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent style={origin.style} className="max-w-[1040px]">
          <p className="text-subject text-xs font-bold tracking-[0.1em] uppercase">
            Compare
          </p>
          <DialogTitle className="font-display -mt-2 pr-8 text-2xl font-extrabold tracking-[-0.02em] md:text-3xl">
            <RichText text={titleOf(comparison)} />
          </DialogTitle>
          <ComparisonBody comparison={comparison} large />
        </DialogContent>
      </Dialog>
    </section>
  );
}

function ComparisonBody({
  comparison: c,
  large,
}: {
  comparison: Comparison;
  large?: boolean;
}) {
  return (
    <>
      <div className="-mx-1 hidden shrink-0 overflow-x-auto px-1 sm:block">
        <table
          className={cn(
            "w-full min-w-[520px] border-separate border-spacing-0 text-left",
            large ? "text-[15px]" : "text-sm",
          )}
        >
          <thead>
            <tr>
              <th
                scope="col"
                className="text-muted-foreground w-[24%] pb-2 pr-3 align-bottom text-xs font-semibold tracking-[0.06em] uppercase"
              >
                Aspect
              </th>
              {c.items.map((item, i) => (
                <th key={item} scope="col" className="pb-2 pr-2 align-bottom">
                  <span
                    style={itemTint(i)}
                    className="tint bg-tint border-tint-border text-tint-ink inline-block rounded-md border px-2 py-1 text-[13px] font-bold"
                  >
                    <RichText text={item} />
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {c.rows.map((row) => (
              <tr key={row.aspect} className={cn(row.key && "bg-subject/10")}>
                <th
                  scope="row"
                  className={cn(
                    "border-t py-2 pr-3 align-top font-medium",
                    row.key
                      ? "text-foreground rounded-l-md pl-2 font-bold"
                      : "text-muted-foreground",
                  )}
                >
                  <RichText text={row.aspect} />
                </th>
                {row.values.map((v, i) => (
                  <td
                    key={i}
                    className={cn(
                      "border-t py-2 pr-3 align-top",
                      row.key && "font-semibold last:rounded-r-md",
                    )}
                  >
                    <RichText text={v} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Phones: one block per aspect instead of a wide table. */}
      <dl className="flex shrink-0 flex-col divide-y sm:hidden">
        {c.rows.map((row) => (
          <div
            key={row.aspect}
            className={cn(
              "flex flex-col gap-1.5 py-2.5",
              row.key && "bg-subject/10 -mx-2 rounded-md px-2",
            )}
          >
            <dt
              className={cn(
                "text-xs font-semibold tracking-[0.04em] uppercase",
                row.key ? "text-foreground" : "text-muted-foreground",
              )}
            >
              <RichText text={row.aspect} />
            </dt>
            {row.values.map((v, i) => (
              <dd
                key={i}
                className="grid grid-cols-[minmax(0,40%)_1fr] gap-2 text-sm"
              >
                <span
                  style={itemTint(i)}
                  className="tint text-tint-ink font-bold [overflow-wrap:anywhere]"
                >
                  <RichText text={c.items[i]} />
                </span>
                <span
                  className={cn(
                    "[overflow-wrap:anywhere]",
                    row.key && "font-semibold",
                  )}
                >
                  <RichText text={v} />
                </span>
              </dd>
            ))}
          </div>
        ))}
      </dl>

      {c.reveal && (
        <p className="bg-subject/10 flex gap-2.5 rounded-lg px-3.5 py-2.5 text-[15px] leading-relaxed">
          <Lightbulb
            className="text-subject mt-0.5 size-4 flex-none"
            aria-hidden="true"
          />
          <span>
            <strong>The reveal: </strong>
            <RichText text={c.reveal} />
          </span>
        </p>
      )}

      {c.whenToUse && (
        <div className="flex flex-col gap-2">
          <h4 className="text-sm font-bold">When to use which</h4>
          <ul className="flex flex-col gap-1.5">
            {c.whenToUse.map((w, i) => (
              <li
                key={i}
                className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 text-sm"
              >
                {c.items[i] && (
                  <span
                    style={itemTint(i)}
                    className="tint text-tint-ink font-bold"
                  >
                    <RichText text={c.items[i]} />
                  </span>
                )}
                <span className="text-muted-foreground min-w-0 flex-[1_1_16rem]">
                  <RichText text={w} />
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {c.code && (
        <div
          className={cn(
            "grid grid-cols-1 gap-3",
            c.code.length === 2 && "md:grid-cols-2",
            c.code.length >= 3 && "lg:grid-cols-3",
          )}
        >
          {c.code.map((snippet, i) => (
            <CodeBlock
              key={i}
              code={snippet}
              label={c.items[i]?.replace(/[`*]/g, "")}
            />
          ))}
        </div>
      )}
    </>
  );
}

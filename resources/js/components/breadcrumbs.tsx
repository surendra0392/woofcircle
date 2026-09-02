import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage } from '@/components/ui/breadcrumb';
import { type BreadcrumbItem as BreadcrumbItemType } from '@/types';
import { Fragment } from 'react';
export function Breadcrumbs({ breadcrumbs, className, dark = false }: { breadcrumbs: BreadcrumbItemType[]; className?: string; dark?: boolean }) {
    const textBaseClass = dark ? 'text-white/50 hover:text-white' : 'text-woof-charcoal/50 hover:text-woof-charcoal';
    const dotClass = dark ? 'bg-white/20' : 'bg-woof-gold/60';
    return (
        <div className={`relative ${className}`}>
            {breadcrumbs.length > 0 && (
                <Breadcrumb>
                    <BreadcrumbList className="gap-2 sm:gap-4">
                        {breadcrumbs.map((item, index) => {
                            const isLast = index === breadcrumbs.length - 1;
                            return (
                                <Fragment key={index}>
                                    <BreadcrumbItem>
                                        {isLast ? (
                                            <BreadcrumbPage className="text-woof-gold text-[9px] font-bold tracking-[0.4em] uppercase sm:text-[10px]">
                                                {item.title}
                                            </BreadcrumbPage>
                                        ) : (
                                            <BreadcrumbLink
                                                href={item.href}
                                                className={`text-[9px] font-black tracking-[0.4em] uppercase transition-colors sm:text-[10px] ${textBaseClass}`}
                                            >
                                                {item.title}
                                            </BreadcrumbLink>
                                        )}
                                    </BreadcrumbItem>
                                    {!isLast && <div className={`mx-1 h-1 w-1 rounded-none sm:mx-2 ${dotClass}`} />}
                                </Fragment>
                            );
                        })}
                    </BreadcrumbList>
                </Breadcrumb>
            )}
        </div>
    );
}

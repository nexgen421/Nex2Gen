export type MenuItem = {
    id: number,
    title: string
    link?: string
    submenus?: MenuItem[]
}
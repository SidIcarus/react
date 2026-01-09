import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function CampaignRangeSelect() {
  return (
    <div className="px-4">
      <Select defaultValue="All">
        <SelectTrigger size="sm">
          <SelectValue/>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Range</SelectLabel>
            <SelectItem value="7">7</SelectItem>
            <SelectItem value="30">30</SelectItem>
            <SelectItem value="90">90</SelectItem>
            <SelectItem value="All">All</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}

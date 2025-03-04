import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "./ui/command";
import { Clock, Loader2, Search, Star, XCircle } from "lucide-react";
import { useLocationSearch } from "@/hooks/use-weather";
import { useNavigate } from "react-router-dom";
import { useSearchHistory } from "@/hooks/use-search-history";
import { format } from "date-fns";
import { useFavorite } from "@/hooks/use-favorite";
const CitySearch = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const { data: locations, isLoading } = useLocationSearch(query);
  const { history, clearHistory, addToHistory } = useSearchHistory();
  const { favorites } = useFavorite();

  useEffect(() => {
    open && setQuery("");
  }, [open]);

  const handleSelect = (cityData: string) => {
    const [lat, lon, name, country, state] = cityData.split("|");

    //Add to search history
    addToHistory.mutate({
      query,
      name,
      lat: parseFloat(lat),
      lon: parseFloat(lon),
      state,
      country,
    });

    setOpen(false);
    navigate(`/city/${name}?lat=${lat}&lon=${lon}/`);
    setQuery("");
  };

  return (
    <>
      <Button
        variant="outline"
        className="relative w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64"
        onClick={() => setOpen(true)}
      >
        <Search className="h-4 w-4 mr-2" />
        Search cities...
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Search cities..."
          value={query}
          onValueChange={setQuery}
        />

        <CommandList>
          {query.length > 2 && !isLoading && (
            <CommandEmpty>No results found.</CommandEmpty>
          )}

          {isLoading && (
            <div className="flex items-center justify-center p-4">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          )}

          {/* render list of favorite city */}
          {favorites.length > 0 && query && (
            <>
              <CommandGroup heading="Favorite Cities">
                {favorites.map((favoriteCity) => {
                  return (
                    <CommandItem
                      key={favoriteCity.id}
                      value={`${favoriteCity.lat}|${favoriteCity.lon}|${
                        favoriteCity.name
                      }|${favoriteCity.country}|${
                        favoriteCity.state ? favoriteCity.state : ""
                      }`}
                      onSelect={handleSelect}
                    >
                      <Star className="mr-2 h-4 w-4 text-yellow-500" />
                      <span>{favoriteCity.name}</span>
                      {favoriteCity.state && (
                        <span className="text-sm text-muted-foreground">
                          , {favoriteCity.state}
                        </span>
                      )}
                      <span className="text-sm text-muted-foreground">
                        , {favoriteCity.country}
                      </span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </>
          )}

          {/* render list of recent search */}
          {history.length > 0 && (
            <>
              <CommandSeparator />
              <CommandGroup>
                <div className="flex items-center justify-between px-2 my-2">
                  <p>Recent Searches</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => clearHistory.mutate()}
                  >
                    <XCircle className="h-4 w-4">Clear</XCircle>
                  </Button>
                </div>

                {history.map((favoriteCity) => {
                  return (
                    <CommandItem
                      key={`${favoriteCity.lat}-${favoriteCity.lon}`}
                      value={`${favoriteCity.lat}|${favoriteCity.lon}|${
                        favoriteCity.name
                      }|${favoriteCity.country}|${
                        favoriteCity.state ? favoriteCity.state : ""
                      }`}
                      onSelect={handleSelect}
                    >
                      <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>{favoriteCity.name}</span>
                      {favoriteCity.state && (
                        <span className="text-sm text-muted-foreground">
                          , {favoriteCity.state}
                        </span>
                      )}
                      <span className="text-sm text-muted-foreground">
                        , {favoriteCity.country}
                      </span>
                      <span className="ml-auto text-xs text-muted-foreground">
                        {format(favoriteCity.searchedAt, "MMM d, h:mm a")}
                      </span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </>
          )}

          {/* render list of suggested city */}
          {locations && locations.length > 0 && (
            <>
              <CommandSeparator />
              <CommandGroup heading="Suggestions">
                {locations.map((location) => {
                  return (
                    <CommandItem
                      key={`${location.lat}-${location.lon}`}
                      value={`${location.lat}|${location.lon}|${
                        location.name
                      }|${location.country}|${
                        location.state ? location.state : ""
                      }`}
                      onSelect={handleSelect}
                    >
                      <Search className="mr-2 h-4 w-4" />
                      <span>{location.name}</span>
                      {location.state && (
                        <span className="text-sm text-muted-foreground">
                          , {location.state}
                        </span>
                      )}
                      <span className="text-sm text-muted-foreground">
                        , {location.country}
                      </span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
};

export default CitySearch;

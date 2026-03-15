import { useState, useRef, useCallback, ChangeEvent, useEffect } from "react";
import debounce from "@/core/entities/function/debounce";
import { useLazySearchUsersQuery } from "@/slices/users.api";
import { useSelector } from "react-redux";
import { selectUsersWithoutCurrent } from "@/slices/users.selectors";

const useUserSearchInput = () => {
  const [search, setSearch] = useState("");
  const [trigger, { isLoading }] = useLazySearchUsersQuery();
  const [showDropdown, setShowDropdown] = useState(false);
  const users = useSelector(selectUsersWithoutCurrent);

  const debouncedSearch = useCallback(debounce((value: string) => {
    if (value && value.length >= 3) {
      trigger(value);
    }
  }, 300), [trigger]);

  useEffect(() => {
    debouncedSearch(search);
  }, [search, debouncedSearch]);
  
  const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setShowDropdown(!!value);
    setSearch(value);
  }, []);

  const handleBlur = () => setTimeout(() => {
    setShowDropdown(false);
    setSearch("")
  }, 150);
  const handleFocus = () => setShowDropdown(!!search);

  const hasUsers = Array.isArray(users) && users.length > 0;

  return {
    search,
    isLoading,
    showDropdown,
    users,
    handleChange,
    handleBlur,
    handleFocus,
    hasUsers,
  };
};

export default useUserSearchInput;

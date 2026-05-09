"""
AI Agents Starter Kit – Sample code with bugs to debug.
Use the Claude agent to identify and fix the problems below.
"""


def calculate_average(numbers):
    """Calculates the average of a list of numbers."""
    # BUG 1: Division by zero when the list is empty
    total = sum(numbers)
    return total / len(numbers)


def find_user(users, name):
    """Searches for a user by name (case-sensitive)."""
    for user in users:
        # BUG 2: Incorrect comparison – should be case-insensitive
        if user["name"] == name:
            return user
    return None


def process_orders(orders):
    """Processes a list of orders and returns the total."""
    # BUG 3: Variable `total` used before being initialized
    for order in orders:
        total += order["value"]
    return total


def list_files(directory):
    """Lists files in a directory recursively."""
    import os
    result = []
    for item in os.listdir(directory):
        path = os.path.join(directory, item)
        if os.path.isdir(path):
            # BUG 4: Potential infinite loop – lack of depth limit
            result.extend(list_files(path))
        else:
            result.append(path)
    return result


def format_date(date_str):
    """Converts a date string to a datetime object."""
    from datetime import datetime
    # BUG 5: Incorrect date format (uses '-' but expects '/')
    return datetime.strptime(date_str, "%d/%m/%Y")


# Demonstration code
if __name__ == "__main__":
    # Test 1: division by zero
    print(calculate_average([]))  # Will raise ZeroDivisionError

    # Test 2: case-sensitive search
    users = [{"name": "Alice"}, {"name": "Bob"}]
    print(find_user(users, "alice"))  # Returns None (bug)

    # Test 3: uninitialized variable
    orders = [{"value": 10}, {"value": 20}]
    print(process_orders(orders))  # Will raise UnboundLocalError

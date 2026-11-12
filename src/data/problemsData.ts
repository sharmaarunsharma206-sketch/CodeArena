import {
  Problem,
  Contest,
  LeaderboardUser,
  UserProfile,
  Submission,
  ContestProblemSummary,
  ContestScoreboardEntry
} from '../types/codeArena';

export const INITIAL_PROBLEMS: Problem[] = [
  {
    id: 'prob-1',
    number: 1,
    title: 'Two Sum',
    slug: 'two-sum',
    difficulty: 'Easy',
    topic: 'Arrays',
    acceptanceRate: '54.2%',
    description: `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.

You may assume that each input would have **exactly one solution**, and you may not use the same element twice.

You can return the answer in any order.`,
    examples: [
      {
        id: 1,
        input: 'nums = [2,7,11,15], target = 9',
        output: '[0,1]',
        explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].',
      },
      {
        id: 2,
        input: 'nums = [3,2,4], target = 6',
        output: '[1,2]',
      },
      {
        id: 3,
        input: 'nums = [3,3], target = 6',
        output: '[0,1]',
      },
    ],
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9',
      'Only one valid answer exists.',
    ],
    hints: [
      'A really brute force way would be to search for all possible pairs of numbers but that would be too slow. Can you do it in O(n)?',
      'Can we use a hash map to check whether target - nums[i] exists in the array?',
    ],
    starterCode: {
      python: `class Solution:
    def twoSum(self, nums: list[int], target: int) -> list[int]:
        seen = {}
        for i, num in enumerate(nums):
            complement = target - num
            if complement in seen:
                return [seen[complement], i]
            seen[num] = i
        return []
`,
      javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}
`,
      cpp: `#include <vector>
#include <unordered_map>
using namespace std;

class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> seen;
        for (int i = 0; i < nums.size(); ++i) {
            int complement = target - nums[i];
            if (seen.find(complement) != seen.end()) {
                return {seen[complement], i};
            }
            seen[nums[i]] = i;
        }
        return {};
    }
};
`,
      java: `import java.util.HashMap;
import java.util.Map;

class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                return new int[] { map.get(complement), i };
            }
            map.put(nums[i], i);
        }
        return new int[0];
    }
}
`,
    },
    testCases: [
      { id: 1, input: '[2,7,11,15], target = 9', expectedOutput: '[0,1]', isSample: true },
      { id: 2, input: '[3,2,4], target = 6', expectedOutput: '[1,2]', isSample: true },
      { id: 3, input: '[3,3], target = 6', expectedOutput: '[0,1]', isSample: true },
      { id: 4, input: '[1,5,8,12,19], target = 27', expectedOutput: '[2,4]' },
    ],
    solved: true,
    companies: ['Google', 'Amazon', 'Apple', 'Meta'],
  },
  {
    id: 'prob-2',
    number: 3,
    title: 'Longest Substring Without Repeating Characters',
    slug: 'longest-substring-without-repeating-characters',
    difficulty: 'Medium',
    topic: 'Strings',
    acceptanceRate: '36.8%',
    description: `Given a string \`s\`, find the length of the **longest substring** without duplicate characters.

A substring is a contiguous non-empty sequence of characters within a string.`,
    examples: [
      {
        id: 1,
        input: 's = "abcabcbb"',
        output: '3',
        explanation: 'The answer is "abc", with the length of 3.',
      },
      {
        id: 2,
        input: 's = "bbbbb"',
        output: '1',
        explanation: 'The answer is "b", with the length of 1.',
      },
      {
        id: 3,
        input: 's = "pwwkew"',
        output: '3',
        explanation: 'The answer is "wke", with the length of 3.',
      },
    ],
    constraints: [
      '0 <= s.length <= 5 * 10^4',
      's consists of English letters, digits, symbols and spaces.',
    ],
    hints: [
      'Use a sliding window with two pointers left and right.',
      'Maintain a set or hash table of characters currently present in the window.',
    ],
    starterCode: {
      python: `class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        char_index = {}
        max_len = 0
        left = 0
        for right, char in enumerate(s):
            if char in char_index and char_index[char] >= left:
                left = char_index[char] + 1
            char_index[char] = right
            max_len = max(max_len, right - left + 1)
        return max_len
`,
      javascript: `/**
 * @param {string} s
 * @return {number}
 */
function lengthOfLongestSubstring(s) {
  let maxLength = 0;
  let left = 0;
  const seen = new Map();

  for (let right = 0; right < s.length; right++) {
    const char = s[right];
    if (seen.has(char) && seen.get(char) >= left) {
      left = seen.get(char) + 1;
    }
    seen.set(char, right);
    maxLength = Math.max(maxLength, right - left + 1);
  }

  return maxLength;
}
`,
      cpp: `#include <string>
#include <unordered_map>
#include <algorithm>
using namespace std;

class Solution {
public:
    int lengthOfLongestSubstring(string s) {
        unordered_map<char, int> seen;
        int maxLen = 0, left = 0;
        for (int right = 0; right < s.length(); ++right) {
            if (seen.count(s[right]) && seen[s[right]] >= left) {
                left = seen[s[right]] + 1;
            }
            seen[s[right]] = right;
            maxLen = max(maxLen, right - left + 1);
        }
        return maxLen;
    }
};
`,
      java: `import java.util.HashMap;
import java.util.Map;

class Solution {
    public int lengthOfLongestSubstring(String s) {
        Map<Character, Integer> seen = new HashMap<>();
        int maxLen = 0, left = 0;
        for (int right = 0; right < s.length(); right++) {
            char c = s.charAt(right);
            if (seen.containsKey(c) && seen.get(c) >= left) {
                left = seen.get(c) + 1;
            }
            seen.put(c, right);
            maxLen = Math.max(maxLen, right - left + 1);
        }
        return maxLen;
    }
}
`,
    },
    testCases: [
      { id: 1, input: 's = "abcabcbb"', expectedOutput: '3', isSample: true },
      { id: 2, input: 's = "bbbbb"', expectedOutput: '1', isSample: true },
      { id: 3, input: 's = "pwwkew"', expectedOutput: '3', isSample: true },
      { id: 4, input: 's = "tmmzuxt"', expectedOutput: '5' },
    ],
    solved: true,
    companies: ['Microsoft', 'Amazon', 'Bloomberg'],
  },
  {
    id: 'prob-3',
    number: 42,
    title: 'Trapping Rain Water',
    slug: 'trapping-rain-water',
    difficulty: 'Hard',
    topic: 'Two Pointers',
    acceptanceRate: '62.1%',
    description: `Given \`n\` non-negative integers representing an elevation map where the width of each bar is \`1\`, compute how much water it can trap after raining.`,
    examples: [
      {
        id: 1,
        input: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]',
        output: '6',
        explanation: 'The above elevation map is represented by array [0,1,0,2,1,0,1,3,2,1,2,1]. In this case, 6 units of rain water are trapped.',
      },
      {
        id: 2,
        input: 'height = [4,2,0,3,2,5]',
        output: '9',
      },
    ],
    constraints: [
      'n == height.length',
      '1 <= n <= 2 * 10^4',
      '0 <= height[i] <= 10^5',
    ],
    hints: [
      'For each element in the array, water trapped above it equals min(max_left, max_right) - height[i].',
      'Can you compute this in O(1) space using two pointers moving inwards?',
    ],
    starterCode: {
      python: `class Solution:
    def trap(self, height: list[int]) -> int:
        if not height:
            return 0
        left, right = 0, len(height) - 1
        left_max, right_max = height[left], height[right]
        water = 0
        while left < right:
            if left_max < right_max:
                left += 1
                left_max = max(left_max, height[left])
                water += left_max - height[left]
            else:
                right -= 1
                right_max = max(right_max, height[right])
                water += right_max - height[right]
        return water
`,
      javascript: `/**
 * @param {number[]} height
 * @return {number}
 */
function trap(height) {
  if (!height.length) return 0;
  let left = 0, right = height.length - 1;
  let leftMax = height[left], rightMax = height[right];
  let water = 0;

  while (left < right) {
    if (leftMax < rightMax) {
      left++;
      leftMax = Math.max(leftMax, height[left]);
      water += leftMax - height[left];
    } else {
      right--;
      rightMax = Math.max(rightMax, height[right]);
      water += rightMax - height[right];
    }
  }
  return water;
}
`,
      cpp: `#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    int trap(vector<int>& height) {
        if (height.empty()) return 0;
        int left = 0, right = height.size() - 1;
        int leftMax = height[left], rightMax = height[right];
        int water = 0;
        while (left < right) {
            if (leftMax < rightMax) {
                left++;
                leftMax = max(leftMax, height[left]);
                water += leftMax - height[left];
            } else {
                right--;
                rightMax = max(rightMax, height[right]);
                water += rightMax - height[right];
            }
        }
        return water;
    }
};
`,
      java: `class Solution {
    public int trap(int[] height) {
        if (height.length == 0) return 0;
        int left = 0, right = height.length - 1;
        int leftMax = height[left], rightMax = height[right];
        int water = 0;
        while (left < right) {
            if (leftMax < rightMax) {
                left++;
                leftMax = Math.max(leftMax, height[left]);
                water += leftMax - height[left];
            } else {
                right--;
                rightMax = Math.max(rightMax, height[right]);
                water += rightMax - height[right];
            }
        }
        return water;
    }
}
`,
    },
    testCases: [
      { id: 1, input: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]', expectedOutput: '6', isSample: true },
      { id: 2, input: 'height = [4,2,0,3,2,5]', expectedOutput: '9', isSample: true },
      { id: 3, input: 'height = [3,0,2,0,4]', expectedOutput: '7' },
    ],
    solved: false,
    companies: ['Google', 'Goldman Sachs', 'Uber'],
  },
  {
    id: 'prob-4',
    number: 20,
    title: 'Valid Parentheses',
    slug: 'valid-parentheses',
    difficulty: 'Easy',
    topic: 'Stack',
    acceptanceRate: '41.5%',
    description: `Given a string \`s\` containing just the characters \`'('\`, \`')'\`, \`'{'\`, \`'}'\`, \`'['\` and \`']'\`, determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.`,
    examples: [
      { id: 1, input: 's = "()"', output: 'true' },
      { id: 2, input: 's = "()[]{}"', output: 'true' },
      { id: 3, input: 's = "(]"', output: 'false' },
      { id: 4, input: 's = "([)]"', output: 'false' },
    ],
    constraints: [
      '1 <= s.length <= 10^4',
      's consists of parentheses only \'()[]{}\'.',
    ],
    hints: [
      'Use a stack to keep track of opening brackets as you iterate through the string.',
      'When you see a closing bracket, check if it matches the top of the stack.',
    ],
    starterCode: {
      python: `class Solution:
    def isValid(self, s: str) -> bool:
        stack = []
        pairs = {')': '(', '}': '{', ']': '['}
        for char in s:
            if char in pairs:
                if not stack or stack[-1] != pairs[char]:
                    return False
                stack.pop()
            else:
                stack.append(char)
        return len(stack) == 0
`,
      javascript: `/**
 * @param {string} s
 * @return {boolean}
 */
function isValid(s) {
  const stack = [];
  const pairs = { ')': '(', '}': '{', ']': '[' };
  for (const char of s) {
    if (pairs[char]) {
      if (stack.pop() !== pairs[char]) return false;
    } else {
      stack.push(char);
    }
  }
  return stack.length === 0;
}
`,
      cpp: `#include <string>
#include <stack>
#include <unordered_map>
using namespace std;

class Solution {
public:
    bool isValid(string s) {
        stack<char> st;
        unordered_map<char, char> pairs = {{')', '('}, {'}', '{'}, {']', '['}};
        for (char c : s) {
            if (pairs.count(c)) {
                if (st.empty() || st.top() != pairs[c]) return false;
                st.pop();
            } else {
                st.push(c);
            }
        }
        return st.empty();
    }
};
`,
      java: `import java.util.Stack;

class Solution {
    public boolean isValid(String s) {
        Stack<Character> stack = new Stack<>();
        for (char c : s.toCharArray()) {
            if (c == '(') stack.push(')');
            else if (c == '{') stack.push('}');
            else if (c == '[') stack.push(']');
            else if (stack.isEmpty() || stack.pop() != c) return false;
        }
        return stack.isEmpty();
    }
}
`,
    },
    testCases: [
      { id: 1, input: 's = "()"', expectedOutput: 'true', isSample: true },
      { id: 2, input: 's = "()[]{}"', expectedOutput: 'true', isSample: true },
      { id: 3, input: 's = "(]"', expectedOutput: 'false', isSample: true },
      { id: 4, input: 's = "{[]}"', expectedOutput: 'true' },
    ],
    solved: true,
    companies: ['Amazon', 'Facebook', 'Spotify'],
  },
  {
    id: 'prob-5',
    number: 146,
    title: 'LRU Cache',
    slug: 'lru-cache',
    difficulty: 'Medium',
    topic: 'Hash Table',
    acceptanceRate: '43.2%',
    description: `Design a data structure that follows the constraints of a **Least Recently Used (LRU) cache**.

Implement the \`LRUCache\` class:
- \`LRUCache(int capacity)\` Initialize the LRU cache with positive size \`capacity\`.
- \`int get(int key)\` Return the value of the \`key\` if the key exists, otherwise return \`-1\`.
- \`void put(int key, int value)\` Update the value of the \`key\` if the \`key\` exists. Otherwise, add the \`key-value\` pair to the cache. If the number of keys exceeds the \`capacity\` from this operation, **evict the least recently used key**.

The functions \`get\` and \`put\` must each run in **O(1)** average time complexity.`,
    examples: [
      {
        id: 1,
        input: '["LRUCache", "put", "put", "get", "put", "get", "put", "get", "get", "get"]\n[[2], [1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]]',
        output: '[null, null, null, 1, null, -1, null, -1, 3, 4]',
      },
    ],
    constraints: [
      '1 <= capacity <= 3000',
      '0 <= key <= 10^4',
      '0 <= value <= 10^5',
      'At most 2 * 10^5 calls will be made to get and put.',
    ],
    hints: [
      'Use a doubly linked list combined with a hash table to achieve O(1) removals and insertions at head/tail.',
    ],
    starterCode: {
      python: `class Node:
    def __init__(self, key: int = 0, val: int = 0):
        self.key = key
        self.val = val
        self.prev = None
        self.next = None

class LRUCache:
    def __init__(self, capacity: int):
        self.cap = capacity
        self.cache = {}
        self.head = Node()
        self.tail = Node()
        self.head.next = self.tail
        self.tail.prev = self.head

    def get(self, key: int) -> int:
        if key in self.cache:
            node = self.cache[key]
            self._remove(node)
            self._add(node)
            return node.val
        return -1

    def put(self, key: int, value: int) -> None:
        if key in self.cache:
            self._remove(self.cache[key])
        node = Node(key, value)
        self.cache[key] = node
        self._add(node)
        if len(self.cache) > self.cap:
            lru = self.head.next
            self._remove(lru)
            del self.cache[lru.key]

    def _remove(self, node: Node):
        node.prev.next = node.next
        node.next.prev = node.prev

    def _add(self, node: Node):
        prev = self.tail.prev
        prev.next = node
        node.prev = prev
        node.next = self.tail
        self.tail.prev = node
`,
      javascript: `class LRUCache {
  /**
   * @param {number} capacity
   */
  constructor(capacity) {
    this.capacity = capacity;
    this.map = new Map();
  }

  /** 
   * @param {number} key
   * @return {number}
   */
  get(key) {
    if (!this.map.has(key)) return -1;
    const val = this.map.get(key);
    this.map.delete(key);
    this.map.set(key, val);
    return val;
  }

  /** 
   * @param {number} key 
   * @param {number} value
   * @return {void}
   */
  put(key, value) {
    if (this.map.has(key)) {
      this.map.delete(key);
    } else if (this.map.size >= this.capacity) {
      const oldestKey = this.map.keys().next().value;
      this.map.delete(oldestKey);
    }
    this.map.set(key, value);
  }
}
`,
      cpp: `#include <unordered_map>
#include <list>
using namespace std;

class LRUCache {
    int capacity;
    list<pair<int, int>> items;
    unordered_map<int, list<pair<int, int>>::iterator> map;
public:
    LRUCache(int cap) : capacity(cap) {}
    
    int get(int key) {
        if (map.find(key) == map.end()) return -1;
        items.splice(items.begin(), items, map[key]);
        return map[key]->second;
    }
    
    void put(int key, int value) {
        if (map.find(key) != map.end()) {
            items.splice(items.begin(), items, map[key]);
            map[key]->second = value;
            return;
        }
        if (items.size() == capacity) {
            int delKey = items.back().first;
            items.pop_back();
            map.erase(delKey);
        }
        items.emplace_front(key, value);
        map[key] = items.begin();
    }
};
`,
      java: `import java.util.LinkedHashMap;
import java.util.Map;

class LRUCache extends LinkedHashMap<Integer, Integer> {
    private int capacity;

    public LRUCache(int capacity) {
        super(capacity, 0.75f, true);
        this.capacity = capacity;
    }

    public int get(int key) {
        return super.getOrDefault(key, -1);
    }

    public void put(int key, int value) {
        super.put(key, value);
    }

    @Override
    protected boolean removeEldestEntry(Map.Entry<Integer, Integer> eldest) {
        return size() > capacity;
    }
}
`,
    },
    testCases: [
      { id: 1, input: 'capacity = 2, put(1,1), put(2,2), get(1)', expectedOutput: '1', isSample: true },
      { id: 2, input: 'put(3,3), get(2)', expectedOutput: '-1', isSample: true },
      { id: 3, input: 'put(4,4), get(1), get(3), get(4)', expectedOutput: '-1, 3, 4' },
    ],
    solved: false,
    companies: ['Netflix', 'Apple', 'DoorDash'],
  },
  {
    id: 'prob-6',
    number: 322,
    title: 'Coin Change',
    slug: 'coin-change',
    difficulty: 'Medium',
    topic: 'Dynamic Programming',
    acceptanceRate: '45.1%',
    description: `You are given an integer array \`coins\` representing coins of different denominations and an integer \`amount\` representing a total amount of money.

Return *the fewest number of coins that you need to make up that amount*. If that amount of money cannot be made up by any combination of the coins, return \`-1\`.

You may assume that you have an infinite number of each kind of coin.`,
    examples: [
      {
        id: 1,
        input: 'coins = [1,2,5], amount = 11',
        output: '3',
        explanation: '11 = 5 + 5 + 1',
      },
      {
        id: 2,
        input: 'coins = [2], amount = 3',
        output: '-1',
      },
      {
        id: 3,
        input: 'coins = [1], amount = 0',
        output: '0',
      },
    ],
    constraints: [
      '1 <= coins.length <= 12',
      '1 <= coins[i] <= 2^31 - 1',
      '0 <= amount <= 10^4',
    ],
    hints: [
      'Can you solve this bottom-up with dynamic programming dp[i] where i is the amount?',
      'Initialize dp array of size amount + 1 with infinity, and dp[0] = 0.',
    ],
    starterCode: {
      python: `class Solution:
    def coinChange(self, coins: list[int], amount: int) -> int:
        dp = [float('inf')] * (amount + 1)
        dp[0] = 0
        for coin in coins:
            for x in range(coin, amount + 1):
                dp[x] = min(dp[x], dp[x - coin] + 1)
        return dp[amount] if dp[amount] != float('inf') else -1
`,
      javascript: `/**
 * @param {number[]} coins
 * @param {number} amount
 * @return {number}
 */
function coinChange(coins, amount) {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (const coin of coins) {
    for (let x = coin; x <= amount; x++) {
      dp[x] = Math.min(dp[x], dp[x - coin] + 1);
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}
`,
      cpp: `#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    int coinChange(vector<int>& coins, int amount) {
        vector<int> dp(amount + 1, amount + 1);
        dp[0] = 0;
        for (int coin : coins) {
            for (int x = coin; x <= amount; ++x) {
                dp[x] = min(dp[x], dp[x - coin] + 1);
            }
        }
        return dp[amount] > amount ? -1 : dp[amount];
    }
};
`,
      java: `import java.util.Arrays;

class Solution {
    public int coinChange(int[] coins, int amount) {
        int[] dp = new int[amount + 1];
        Arrays.fill(dp, amount + 1);
        dp[0] = 0;
        for (int coin : coins) {
            for (int x = coin; x <= amount; x++) {
                dp[x] = Math.min(dp[x], dp[x - coin] + 1);
            }
        }
        return dp[amount] > amount ? -1 : dp[amount];
    }
}
`,
    },
    testCases: [
      { id: 1, input: 'coins = [1,2,5], amount = 11', expectedOutput: '3', isSample: true },
      { id: 2, input: 'coins = [2], amount = 3', expectedOutput: '-1', isSample: true },
      { id: 3, input: 'coins = [1], amount = 0', expectedOutput: '0', isSample: true },
      { id: 4, input: 'coins = [186,419,83,408], amount = 6249', expectedOutput: '20' },
    ],
    solved: true,
    companies: ['Airbnb', 'ByteDance', 'Stripe'],
  },
];

export const INITIAL_CONTESTS: Contest[] = [
  {
    id: 'contest-428',
    title: 'Weekly Contest 428',
    code: 'WC-428',
    startTime: 'Live Now',
    targetTimestamp: Date.now() + 1000 * 60 * 74, // 1h 14m remaining
    durationMinutes: 90,
    status: 'live',
    registeredCount: 18450,
    isRegistered: true,
    problemCount: 4,
    ratingChangeEligible: true,
    topPrize: '$500 + Code Arena Swag',
  },
  {
    id: 'contest-142',
    title: 'Biweekly Contest 142',
    code: 'BWC-142',
    startTime: 'Tomorrow, 07:30 PM PST',
    targetTimestamp: Date.now() + 1000 * 60 * 60 * 19, // 19h away
    durationMinutes: 90,
    status: 'upcoming',
    registeredCount: 9420,
    isRegistered: false,
    problemCount: 4,
    ratingChangeEligible: true,
    topPrize: '$250 + Pro Tier Annual',
  },
  {
    id: 'contest-finals',
    title: 'Global Arena Grandmaster Invitational',
    code: 'GAGI-2026',
    startTime: 'Saturday, 09:00 AM PST',
    targetTimestamp: Date.now() + 1000 * 60 * 60 * 72, // 3 days away
    durationMinutes: 120,
    status: 'upcoming',
    registeredCount: 3240,
    isRegistered: false,
    problemCount: 6,
    ratingChangeEligible: true,
    topPrize: '$5,000 + Trophy',
  },
  {
    id: 'contest-427',
    title: 'Weekly Contest 427',
    code: 'WC-427',
    startTime: 'Ended 3 days ago',
    targetTimestamp: Date.now() - 1000 * 60 * 60 * 72,
    durationMinutes: 90,
    status: 'past',
    registeredCount: 22180,
    isRegistered: true,
    problemCount: 4,
    ratingChangeEligible: true,
  },
];

export const INITIAL_LEADERBOARD: LeaderboardUser[] = [
  {
    rank: 1,
    username: 'tourist',
    name: 'Gennady Korotkevich',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    country: 'Poland',
    countryCode: 'PL',
    rating: 3842,
    tier: 'Grandmaster',
    solvedCount: 1840,
    globalPercentile: 'Top 0.01%',
  },
  {
    rank: 2,
    username: 'ecnerwala',
    name: 'Andrew He',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
    country: 'United States',
    countryCode: 'US',
    rating: 3698,
    tier: 'Grandmaster',
    solvedCount: 1720,
    globalPercentile: 'Top 0.02%',
  },
  {
    rank: 3,
    username: 'Benq',
    name: 'Benjamin Qi',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80',
    country: 'United States',
    countryCode: 'US',
    rating: 3612,
    tier: 'Grandmaster',
    solvedCount: 1684,
    globalPercentile: 'Top 0.05%',
  },
  {
    rank: 4,
    username: 'Petr',
    name: 'Petr Mitrichev',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=256&q=80',
    country: 'Switzerland',
    countryCode: 'CH',
    rating: 3490,
    tier: 'Grandmaster',
    solvedCount: 1590,
    globalPercentile: 'Top 0.1%',
  },
  {
    rank: 5,
    username: 'Radewoosh',
    name: 'Radomił Baran',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=256&q=80',
    country: 'Poland',
    countryCode: 'PL',
    rating: 3420,
    tier: 'Grandmaster',
    solvedCount: 1530,
    globalPercentile: 'Top 0.15%',
  },
  {
    rank: 6,
    username: 'neal',
    name: 'Neal Wu',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=256&q=80',
    country: 'United States',
    countryCode: 'US',
    rating: 3315,
    tier: 'Master',
    solvedCount: 1480,
    globalPercentile: 'Top 0.2%',
  },
  {
    rank: 7,
    username: 'marat.g',
    name: 'Marat Gimranov',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=256&q=80',
    country: 'Georgia',
    countryCode: 'GE',
    rating: 3260,
    tier: 'Master',
    solvedCount: 1390,
    globalPercentile: 'Top 0.3%',
  },
  {
    rank: 8,
    username: 'alex_dev',
    name: 'Alex Morgan (You)',
    avatar: '/src/assets/images/avatar_executive_user_1794465167625.jpg',
    country: 'United States',
    countryCode: 'US',
    rating: 2184,
    tier: 'Master',
    solvedCount: 486,
    globalPercentile: 'Top 1.2%',
  },
];

export const INITIAL_SUBMISSIONS: Submission[] = [
  {
    id: 'sub-901',
    problemId: 'prob-1',
    problemTitle: 'Two Sum',
    problemSlug: 'two-sum',
    difficulty: 'Easy',
    language: 'python',
    status: 'Accepted',
    runtime: '42 ms',
    runtimePercentile: 'Beats 92.4%',
    memory: '17.8 MB',
    memoryPercentile: 'Beats 84.1%',
    code: `class Solution:\n    def twoSum(self, nums: list[int], target: int) -> list[int]:\n        seen = {}\n        for i, num in enumerate(nums):\n            comp = target - num\n            if comp in seen:\n                return [seen[comp], i]\n            seen[num] = i\n        return []`,
    timestamp: '14 minutes ago',
    testCasesPassed: { passed: 4, total: 4 },
  },
  {
    id: 'sub-898',
    problemId: 'prob-2',
    problemTitle: 'Longest Substring Without Repeating Characters',
    problemSlug: 'longest-substring-without-repeating-characters',
    difficulty: 'Medium',
    language: 'javascript',
    status: 'Accepted',
    runtime: '68 ms',
    runtimePercentile: 'Beats 88.7%',
    memory: '46.2 MB',
    memoryPercentile: 'Beats 79.5%',
    code: `function lengthOfLongestSubstring(s) {\n  let maxLen = 0, left = 0;\n  const map = new Map();\n  for (let r = 0; r < s.length; r++) {\n    if (map.has(s[r]) && map.get(s[r]) >= left) {\n      left = map.get(s[r]) + 1;\n    }\n    map.set(s[r], r);\n    maxLen = Math.max(maxLen, r - left + 1);\n  }\n  return maxLen;\n}`,
    timestamp: '2 hours ago',
    testCasesPassed: { passed: 4, total: 4 },
  },
  {
    id: 'sub-884',
    problemId: 'prob-3',
    problemTitle: 'Trapping Rain Water',
    problemSlug: 'trapping-rain-water',
    difficulty: 'Hard',
    language: 'cpp',
    status: 'Time Limit Exceeded',
    runtime: 'N/A',
    runtimePercentile: '0%',
    memory: '24.1 MB',
    memoryPercentile: 'N/A',
    code: `// Brute force solution with nested loop\nclass Solution {\npublic:\n  int trap(vector<int>& height) {\n    int ans = 0;\n    for(int i=0; i<height.size(); ++i) { ... }\n    return ans;\n  }\n};`,
    timestamp: 'Yesterday',
    testCasesPassed: { passed: 2, total: 3 },
  },
  {
    id: 'sub-872',
    problemId: 'prob-6',
    problemTitle: 'Coin Change',
    problemSlug: 'coin-change',
    difficulty: 'Medium',
    language: 'python',
    status: 'Accepted',
    runtime: '320 ms',
    runtimePercentile: 'Beats 81.3%',
    memory: '16.9 MB',
    memoryPercentile: 'Beats 91.0%',
    code: `class Solution:\n    def coinChange(self, coins: list[int], amount: int) -> int:\n        dp = [float('inf')] * (amount + 1)\n        dp[0] = 0\n        for c in coins:\n            for x in range(c, amount + 1):\n                dp[x] = min(dp[x], dp[x - c] + 1)\n        return dp[amount] if dp[amount] != float('inf') else -1`,
    timestamp: '3 days ago',
    testCasesPassed: { passed: 4, total: 4 },
  },
];

// Generate 12-month activity heatmap data (52 weeks x 7 days)
export const generateActivityData = () => {
  const data = [];
  const today = new Date();
  for (let i = 180; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    // realistic commit/solve pattern
    const rand = Math.random();
    let count = 0;
    let level: 0 | 1 | 2 | 3 | 4 = 0;
    if (rand > 0.4) {
      count = Math.floor(Math.random() * 6) + 1;
      level = count >= 5 ? 4 : count >= 3 ? 3 : count >= 2 ? 2 : 1;
    }
    data.push({ date: dateStr, count, level });
  }
  return data;
};

export const INITIAL_USER_PROFILE: UserProfile = {
  id: 'usr-codearena-alex',
  username: 'alex_dev',
  fullName: 'Alex Morgan',
  email: 'alex@apexsaas.io',
  avatar: '/src/assets/images/avatar_executive_user_1794465167625.jpg',
  bio: 'Competitive programmer & distributed systems engineer. Preparing for ICPC World Finals and building scalable edge infrastructure.',
  country: 'United States',
  rating: 2184,
  globalRank: 1420,
  streakDays: 18,
  maxStreak: 45,
  solvedTotal: 486,
  solvedEasy: 210,
  totalEasy: 840,
  solvedMedium: 224,
  totalMedium: 1680,
  solvedHard: 52,
  totalHard: 720,
  languageStats: [
    { language: 'Python', count: 284, percentage: 58.4 },
    { language: 'JavaScript / TS', count: 122, percentage: 25.1 },
    { language: 'C++', count: 64, percentage: 13.2 },
    { language: 'Java', count: 16, percentage: 3.3 },
  ],
  activityData: generateActivityData(),
  badges: [
    {
      id: 'badge-1',
      name: 'Knight of Algorithms',
      description: 'Maintained rating above 2100 in official Code Arena contests.',
      icon: 'Shield',
      unlockedDate: 'Oct 2026',
    },
    {
      id: 'badge-2',
      name: 'Streak Centurion',
      description: 'Solved at least one algorithmic challenge for 30 consecutive days.',
      icon: 'Flame',
      unlockedDate: 'Aug 2026',
    },
    {
      id: 'badge-3',
      name: 'Dynamic Programming Master',
      description: 'Solved over 100 Medium and Hard Dynamic Programming challenges.',
      icon: 'Zap',
      unlockedDate: 'Sep 2026',
    },
    {
      id: 'badge-4',
      name: 'Speed Demon',
      description: 'Achieved top 5% execution runtime across 50 consecutive submissions.',
      icon: 'Timer',
      unlockedDate: 'Nov 2026',
    },
  ],
};

export const INITIAL_CONTEST_PROBLEMS: ContestProblemSummary[] = [
  {
    qNumber: 1,
    problemId: 'prob-1',
    title: 'Two Sum',
    slug: 'two-sum',
    difficulty: 'Easy',
    points: 300,
    solved: false,
    attempts: 0,
  },
  {
    qNumber: 2,
    problemId: 'prob-2',
    title: 'Longest Substring Without Repeating Characters',
    slug: 'longest-substring-without-repeating-characters',
    difficulty: 'Medium',
    points: 400,
    solved: false,
    attempts: 0,
  },
  {
    qNumber: 3,
    problemId: 'prob-6',
    title: 'Coin Change',
    slug: 'coin-change',
    difficulty: 'Medium',
    points: 500,
    solved: false,
    attempts: 0,
  },
  {
    qNumber: 4,
    problemId: 'prob-3',
    title: 'Trapping Rain Water',
    slug: 'trapping-rain-water',
    difficulty: 'Hard',
    points: 600,
    solved: false,
    attempts: 0,
  },
];

export const INITIAL_CONTEST_SCOREBOARD: ContestScoreboardEntry[] = [
  {
    rank: 1,
    username: 'tourist',
    name: 'Gennady Korotkevich',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    country: 'Poland',
    score: 1800,
    penaltyMinutes: 34,
    problems: {
      q1: { solved: true, time: '00:04:12', attempts: 1 },
      q2: { solved: true, time: '00:08:45', attempts: 1 },
      q3: { solved: true, time: '00:14:20', attempts: 1 },
      q4: { solved: true, time: '00:27:08', attempts: 1 },
    },
  },
  {
    rank: 2,
    username: 'ecnerwala',
    name: 'Andrew He',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
    country: 'United States',
    score: 1800,
    penaltyMinutes: 42,
    problems: {
      q1: { solved: true, time: '00:03:50', attempts: 1 },
      q2: { solved: true, time: '00:11:15', attempts: 1 },
      q3: { solved: true, time: '00:19:30', attempts: 1 },
      q4: { solved: true, time: '00:33:40', attempts: 2 },
    },
  },
  {
    rank: 3,
    username: 'Benq',
    name: 'Benjamin Qi',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80',
    country: 'United States',
    score: 1800,
    penaltyMinutes: 48,
    problems: {
      q1: { solved: true, time: '00:05:10', attempts: 1 },
      q2: { solved: true, time: '00:12:00', attempts: 1 },
      q3: { solved: true, time: '00:22:18', attempts: 1 },
      q4: { solved: true, time: '00:39:05', attempts: 1 },
    },
  },
  {
    rank: 4,
    username: 'Petr',
    name: 'Petr Mitrichev',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=256&q=80',
    country: 'Switzerland',
    score: 1200,
    penaltyMinutes: 28,
    problems: {
      q1: { solved: true, time: '00:06:22', attempts: 1 },
      q2: { solved: true, time: '00:14:10', attempts: 1 },
      q3: { solved: true, time: '00:24:55', attempts: 1 },
      q4: { solved: false, attempts: 2 },
    },
  },
  {
    rank: 5,
    username: 'Radewoosh',
    name: 'Radomił Baran',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=256&q=80',
    country: 'Poland',
    score: 1200,
    penaltyMinutes: 32,
    problems: {
      q1: { solved: true, time: '00:05:40', attempts: 1 },
      q2: { solved: true, time: '00:16:30', attempts: 1 },
      q3: { solved: true, time: '00:26:15', attempts: 1 },
      q4: { solved: false, attempts: 1 },
    },
  },
  {
    rank: 6,
    username: 'alex_dev',
    name: 'Alex Morgan (You)',
    avatar: '/src/assets/images/avatar_executive_user_1794465167625.jpg',
    country: 'United States',
    score: 0,
    penaltyMinutes: 0,
    isCurrentUser: true,
    problems: {
      q1: { solved: false, attempts: 0 },
      q2: { solved: false, attempts: 0 },
      q3: { solved: false, attempts: 0 },
      q4: { solved: false, attempts: 0 },
    },
  },
  {
    rank: 7,
    username: 'neal',
    name: 'Neal Wu',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=256&q=80',
    country: 'United States',
    score: 700,
    penaltyMinutes: 22,
    problems: {
      q1: { solved: true, time: '00:07:15', attempts: 1 },
      q2: { solved: true, time: '00:15:30', attempts: 1 },
      q3: { solved: false, attempts: 1 },
      q4: { solved: false, attempts: 0 },
    },
  },
  {
    rank: 8,
    username: 'marat.g',
    name: 'Marat Gimranov',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=256&q=80',
    country: 'Georgia',
    score: 300,
    penaltyMinutes: 8,
    problems: {
      q1: { solved: true, time: '00:08:12', attempts: 1 },
      q2: { solved: false, attempts: 2 },
      q3: { solved: false, attempts: 0 },
      q4: { solved: false, attempts: 0 },
    },
  },
];

export function calculateSmartGrace(latencies: number[], expectedIntervalSeconds: number): number {
  if (latencies.length < 3) return 5; 

  // 1. Find the longest gap we've seen recently (Worst Case)
  const maxLatency = Math.max(...latencies);
  

  const lateness = Math.max(0, maxLatency - expectedIntervalSeconds);

  // 3. Add a 50% safety buffer to that lateness
  // e.g. 10s late -> Safety buffer is 15s
  const smartBufferSeconds = Math.ceil(lateness * 1.5);


  const smartMinutes = Math.ceil(smartBufferSeconds / 60);
  

  return Math.max(2, smartMinutes);
}
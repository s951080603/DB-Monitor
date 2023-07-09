SELECT
  mac,
  sensorid,
  start_interval,
  "locDesc",
  "Desc",
  value,
  adjusted_value,
  interpolated_value,
  ROUND(
    AVG(interpolated_value) OVER (
      PARTITION BY
        sensorid
      ORDER BY
        sensorid,
        start_interval ROWS BETWEEN 5 PRECEDING
        AND 1 PRECEDING
    ),
    2
  ) AS moving_average
FROM
  (
    SELECT
      start_interval,
      sensorid,
      "locDesc",
      mac,
      "Desc",
      value,
      adjusted_value,
      CASE
        WHEN adjusted_value IS NULL THEN ROUND(
          (
            LAG (adjusted_value) OVER (
              ORDER BY
                sensorid,
                start_interval
            ) + LEAD (adjusted_value) OVER (
              ORDER BY
                sensorid,
                start_interval
            )
          ) / 2,
          2
        )
        ELSE adjusted_value
      END AS interpolated_value
    FROM
      (
        SELECT
          re.mac,
          s."Desc",
          l."locDesc",
          g.start_interval,
          g.sensorid,
          g.value,
          CASE
            WHEN s."Desc" = 'TVOC' THEN g.value * 1000
            ELSE g.value
          END AS adjusted_value
        FROM
          (
            SELECT
              grid.start_interval,
              sensor.sensorid,
              t.value
            FROM
              (
                SELECT
                  generate_series (
                    '2023/07/07 00:00',
                    '2023/07/07 16:00'::timestamp without time zone,
                    interval '20 min'
                  ) AS start_interval
              ) grid
              CROSS JOIN (
                SELECT DISTINCT
                  sensorid
                FROM
                  records
              ) sensor
              LEFT JOIN records t ON t.sensorid = sensor.sensorid
              AND t."timestamp" >= grid.start_interval
              AND t."timestamp" < grid.start_interval + interval '20 min'
              LEFT JOIN registedsnrs re ON re.sensorid = t.sensorid
          ) g
          INNER JOIN registedsnrs re ON re.sensorid = g.sensorid
          INNER JOIN subtype s ON s.stypeid = re.stypeid
          AND (s."Desc" = 'PM2.5')
          INNER JOIN locations l ON l.locid = re.locid
      ) subquery
  ) subquery2
ORDER BY
  sensorid,
  start_interval
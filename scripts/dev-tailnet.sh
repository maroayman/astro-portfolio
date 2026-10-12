# Local dev — bind only to the Tailscale interface.
#
# `astro dev` with no --host binds to localhost, which is unreachable from
# other tailnet devices. Passing the Tailscale IP exposes the preview to your
# own devices only — NOT to the LAN, and NOT to the public internet.
#
# Any device signed into the same tailnet can then open:
#   http://100.125.186.109:4321
#
# To stop:  astro dev stop
#
# Note: `astro dev` here is plain HTTP. That is fine here — the connection
# travels inside the encrypted WireGuard tunnel, so it is not exposed on the
# local network. If you later want HTTPS or a magic DNS name
# (machine.tailnet.ts.net), enable `tailscale serve` — it needs one-time
# tailnet admin approval at https://login.tailscale.com/f/serve

tailscale_ip=$(tailscale ip -4 2>/dev/null | head -1)

if [ -z "$tailscale_ip" ]; then
	echo "Tailscale is not running or not logged in. Falling back to localhost."
	exec astro dev "$@"
fi

echo "Binding dev server to Tailscale IP: $tailscale_ip"
exec astro dev --host "$tailscale_ip" "$@"